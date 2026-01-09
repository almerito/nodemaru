<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShaderRequest extends FormRequest
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
        return [
            'name' => 'required|min:2|max:100',
            'label' => 'required|min:2|max:100',
            'shader_category_id' => 'required|exists:shader_categories,id',
            'shader_subcategory_id' => 'nullable|exists:shader_subcategories,id',
            'shader_author_id' => 'nullable|exists:shader_authors,id',
            'has_input' => 'boolean',
            'has_output' => 'boolean',
            'has_param_input' => 'boolean',
            'has_param_output' => 'boolean',
            'accept_nodes' => 'nullable|json',
            'params' => 'nullable|json',
            'set_function' => 'nullable|json',
            'is_active' => 'boolean',
            'order' => 'integer|min:0|max:65535',
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
