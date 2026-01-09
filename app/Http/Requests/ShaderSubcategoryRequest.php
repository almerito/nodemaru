<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShaderSubcategoryRequest extends FormRequest
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
        $categoryId = $this->get('shader_category_id');

        return [
            'shader_category_id' => 'required|exists:shader_categories,id',
            'name' => [
                'required',
                'min:2',
                'max:100',
                // Unicità composta: name + shader_category_id, escludendo il record corrente in update
                \Illuminate\Validation\Rule::unique('shader_subcategories')->where(function ($query) use ($categoryId) {
                    return $query->where('shader_category_id', $categoryId);
                })->ignore($id),
            ],
            'label' => 'required|min:2|max:100',
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
