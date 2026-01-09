<!-- field_type_name -->
@php
    $field['value'] = old($field['name']) ?? $field['value'] ?? $field['default'] ?? '[]';
    // If value is array (from casting), encode it. If it's string, leave it (unless empty/null)
    if (is_array($field['value'])) {
        $field['value'] = json_encode($field['value']);
    }
    // Ensure it's valid JSON for initial render catch
    $value = $field['value'];
    if (!$value || $value == '') $value = '[]';
@endphp

@include('crud::fields.inc.wrapper_start')
    <label>{!! $field['label'] !!}</label>
    @include('crud::fields.inc.translatable_icon')

    <div class="array-json-sub-wrapper">
        <input
            type="hidden"
            name="{{ $field['name'] }}"
            value="{{ $value }}"
            data-init-function="bpFieldInitArrayJsonElement"
        >

        <div class="array-json-container">
            <!-- JS will populate inputs here -->
        </div>

        <button type="button" class="btn btn-sm btn-light mt-2 add-item-btn"><i class="la la-plus"></i> Add Item</button>
    </div>

    {{-- HINT --}}
    @if (isset($field['hint']))
        <p class="help-block">{!! $field['hint'] !!}</p>
    @endif
@include('crud::fields.inc.wrapper_end')

@if ($crud->checkIfFieldIsFirstOfItsType($field))

    {{-- FIELD EXTRA CSS  --}}
    {{-- push things in the after_styles section --}}
    @push('crud_fields_styles')
        <!-- no special styles needed -->
    @endpush

    {{-- FIELD EXTRA JS --}}
    {{-- push things in the after_scripts section --}}
    @push('crud_fields_scripts')
        <script>
            function bpFieldInitArrayJsonElement(element) {
                // Backpack might pass a jQuery object or a DOM element
                const hiddenInput = element.jquery ? element[0] : element;
                
                // Use closest wrapper to be safe about hierarchy
                const wrapper = hiddenInput.closest('.array-json-sub-wrapper');
                if (!wrapper) return; 

                const container = wrapper.querySelector('.array-json-container');
                const addBtn = wrapper.querySelector('.add-item-btn');

                let currentValue = [];
                try {
                    currentValue = JSON.parse(hiddenInput.value);
                    if (!Array.isArray(currentValue)) currentValue = [];
                } catch(e) {
                    currentValue = [];
                }
                
                function render() {
                    container.innerHTML = '';
                    currentValue.forEach((val, index) => {
                        const row = document.createElement('div');
                        row.classList.add('input-group', 'mb-2');
                        
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.classList.add('form-control');
                        input.value = val;
                        
                        // Sync on change
                        input.addEventListener('input', (e) => {
                            currentValue[index] = e.target.value;
                            updateHidden();
                        });

                        const btnDiv = document.createElement('div');
                        btnDiv.classList.add('input-group-append');
                        
                        const removeBtn = document.createElement('button');
                        removeBtn.type = 'button';
                        removeBtn.classList.add('btn', 'btn-danger');
                        removeBtn.innerHTML = '<i class="la la-trash"></i>';
                        removeBtn.addEventListener('click', () => {
                            currentValue.splice(index, 1);
                            updateHidden();
                            render();
                        });

                        btnDiv.appendChild(removeBtn);
                        row.appendChild(input);
                        row.appendChild(btnDiv);
                        container.appendChild(row);
                    });
                }

                function updateHidden() {
                    hiddenInput.value = JSON.stringify(currentValue);
                    // trigger change for backpack dirty checks
                    hiddenInput.dispatchEvent(new Event('change'));
                }

                addBtn.addEventListener('click', () => {
                    currentValue.push('');
                    render();
                    updateHidden();
                });

                render();
            }
        </script>
    @endpush
@endif
