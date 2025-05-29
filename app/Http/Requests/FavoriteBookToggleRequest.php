<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FavoriteBookToggleRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher_name' => 'required|string|max:255',
            'sales_date' => 'required|string|max:10',
            'image_url' => 'required|string|max:500',
            'item_caption' => 'required|string|max:1000',
            'item_price' => 'required|integer|min:0|max:99999',
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
            'title.required' => 'タイトルは必須です。',
            'title.string' => 'タイトルは文字列で入力してください。',
            'title.max' => 'タイトルは255文字以内で入力してください。',
            'author.required' => '著者は必須です。',
            'author.string' => '著者は文字列で入力してください。',
            'author.max' => '著者は255文字以内で入力してください。',
            'publisher_name.required' => '出版社名は必須です。',
            'publisher_name.string' => '出版社名は文字列で入力してください。',
            'publisher_name.max' => '出版社名は255文字以内で入力してください。',
            'sales_date.required' => '発売日は必須です。',
            'sales_date.string' => '発売日は文字列で入力してください。',
            'sales_date.max' => '発売日は10文字以内で入力してください。',
            'image_url.required' => '画像URLは必須です。',
            'image_url.string' => '画像URLは文字列で入力してください。',
            'image_url.max' => '画像URLは500文字以内で入力してください。',
            'item_caption.required' => '商品説明は必須です。',
            'item_caption.string' => '商品説明は文字列で入力してください。',
            'item_caption.max' => '商品説明は1000文字以内で入力してください。',
            'item_price.required' => '価格は必須です。',
            'item_price.integer' => '価格は整数で入力してください。',
            'item_price.min' => '価格は0以上で入力してください。',
            'item_price.max' => '価格は99999以下で入力してください。',
        ];
    }
}