<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShaderCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // only allow updates if the user is logged in
        return backpack_auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $id = $this->route('id') ?? $this->get('id');
        
        return [
            'name' => 'required|min:2|max:100|unique:shader_categories,name,' . $id,
            'label' => 'required|min:2|max:100',
            'color' => 'nullable|max:20',
            'order' => 'nullable|integer|min:0|max:65535',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the validation attributes that apply to the request.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            //
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array
     */
    public function messages()
    {
        return [
            //
        ];
    }
}
