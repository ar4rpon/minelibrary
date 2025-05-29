<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookShelfStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'book_shelf_name' => 'required|string|max:100',
            'description' => 'required|string|max:500',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'book_shelf_name.required' => '本棚名は必須です。',
            'book_shelf_name.string' => '本棚名は文字列で入力してください。',
            'book_shelf_name.max' => '本棚名は100文字以内で入力してください。',
            'description.required' => '説明は必須です。',
            'description.string' => '説明は文字列で入力してください。',
            'description.max' => '説明は500文字以内で入力してください。',
        ];
    }
}