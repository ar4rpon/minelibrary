<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookShelfBookRequest extends FormRequest
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
            'isbns' => 'required|array|min:1',
            'isbns.*' => 'required|string|max:13|exists:books,isbn',
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
            'isbns.required' => 'ISBNリストは必須です。',
            'isbns.array' => 'ISBNリストは配列で入力してください。',
            'isbns.min' => '少なくとも1つのISBNを指定してください。',
            'isbns.*.required' => 'ISBNは必須です。',
            'isbns.*.string' => 'ISBNは文字列で入力してください。',
            'isbns.*.max' => 'ISBNは13文字以内で入力してください。',
            'isbns.*.exists' => '指定されたISBNの本が存在しません。',
        ];
    }
}