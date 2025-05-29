<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookSearchRequest extends FormRequest
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
            'keyword' => 'nullable|string|max:100',
            'page' => 'nullable|integer|min:1|max:100',
            'genre' => 'nullable|string|max:20',
            'sort' => 'nullable|string|in:standard,sales,+releaseDate,-releaseDate,+itemPrice,-itemPrice',
            'searchMethod' => 'nullable|in:title,isbn',
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
            'keyword.string' => 'キーワードは文字列で入力してください。',
            'keyword.max' => 'キーワードは100文字以内で入力してください。',
            'page.integer' => 'ページ番号は整数で入力してください。',
            'page.min' => 'ページ番号は1以上で入力してください。',
            'page.max' => 'ページ番号は100以下で入力してください。',
            'genre.string' => 'ジャンルは文字列で入力してください。',
            'genre.max' => 'ジャンルは20文字以内で入力してください。',
            'sort.string' => 'ソート方法は文字列で入力してください。',
            'sort.in' => 'ソート方法が無効です。',
            'searchMethod.in' => '検索方法はtitleまたはisbnを指定してください。',
        ];
    }
}