<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookShelfRemoveBookRequest extends FormRequest
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
            'book_shelf_id' => 'required|integer|exists:book_shelves,id',
            'isbn' => 'required|string|max:13|exists:books,isbn',
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
            'book_shelf_id.required' => '本棚IDは必須です。',
            'book_shelf_id.integer' => '本棚IDは整数で入力してください。',
            'book_shelf_id.exists' => '指定された本棚が存在しません。',
            'isbn.required' => 'ISBNは必須です。',
            'isbn.string' => 'ISBNは文字列で入力してください。',
            'isbn.max' => 'ISBNは13文字以内で入力してください。',
            'isbn.exists' => '指定されたISBNの本が存在しません。',
        ];
    }
}