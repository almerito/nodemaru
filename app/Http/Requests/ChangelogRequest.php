<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChangelogRequest extends FormRequest
{
    public function authorize()
    {
        // only allow updates if the user is logged in
        return backpack_auth()->check();
    }

    public function rules()
    {
        return [
            'version' => 'required|min:1|max:255',
            'content' => 'required',
        ];
    }
}
