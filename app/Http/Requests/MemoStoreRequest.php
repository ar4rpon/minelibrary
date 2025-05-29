<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MemoStoreRequest extends FormRequest
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
            'isbn' => 'required|string|max:13',
            'memo' => 'required|string|max:2000',
            'memo_chapter' => 'nullable|integer|min:1|max:999',
            'memo_page' => 'nullable|integer|min:1|max:9999',
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
            'isbn.required' => 'ISBNは必須です。',
            'isbn.string' => 'ISBNは文字列で入力してください。',
            'isbn.max' => 'ISBNは13文字以内で入力してください。',
            'memo.required' => 'メモ内容は必須です。',
            'memo.string' => 'メモ内容は文字列で入力してください。',
            'memo.max' => 'メモ内容は2000文字以内で入力してください。',
            'memo_chapter.integer' => '章番号は整数で入力してください。',
            'memo_chapter.min' => '章番号は1以上で入力してください。',
            'memo_chapter.max' => '章番号は999以下で入力してください。',
            'memo_page.integer' => 'ページ番号は整数で入力してください。',
            'memo_page.min' => 'ページ番号は1以上で入力してください。',
            'memo_page.max' => 'ページ番号は9999以下で入力してください。',
        ];
    }
}