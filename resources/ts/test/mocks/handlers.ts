import { http, HttpResponse } from 'msw';
import type { BookData, FavoriteStatusResponse } from '@/types/api';

export const handlers = [
  // お気に入り状態取得
  http.get('/api/books/favorite-status', ({ request }) => {
    const url = new URL(request.url);
    const isbn = url.searchParams.get('isbn');
    
    if (!isbn) {
      return HttpResponse.json({ error: 'ISBN is required' }, { status: 400 });
    }

    // テスト用のモックデータ
    const mockResponse: FavoriteStatusResponse = {
      isFavorite: isbn === '9784297142726', // 特定のISBNのみお気に入り
    };

    return HttpResponse.json(mockResponse);
  }),

  // お気に入りトグル
  http.post('/api/books/toggle-favorite', async ({ request }) => {
    const body = await request.json() as { book: BookData } | BookData;
    
    // リクエストボディの構造を確認
    const bookData = 'book' in body ? body.book : body;
    
    if (!bookData?.isbn) {
      return HttpResponse.json({ error: 'ISBN is required' }, { status: 400 });
    }

    return HttpResponse.json({ success: true });
  }),

  // 読書状態更新
  http.post('/api/books/update-status', async ({ request }) => {
    const body = await request.json() as { isbn: string; readStatus: string };
    
    if (!body.isbn || !body.readStatus) {
      return HttpResponse.json({ error: 'ISBN and readStatus are required' }, { status: 400 });
    }

    return HttpResponse.json({ success: true });
  }),

  // 本棚一覧取得
  http.get('/api/book-shelf/get/mylist', () => {
    return HttpResponse.json([
      { id: 1, book_shelf_name: 'テスト本棚1' },
      { id: 2, book_shelf_name: 'テスト本棚2' },
    ]);
  }),

  // 本棚作成
  http.post('/api/book-shelf/create', async ({ request }) => {
    const body = await request.json() as { book_shelf_name: string; description: string };
    
    return HttpResponse.json({
      id: 99,
      book_shelf_name: body.book_shelf_name,
      description: body.description,
    }, { status: 201 });
  }),

  // 本棚に本を追加
  http.post('/api/book-shelf/add/books', async ({ request }) => {
    const body = await request.json() as { book_shelf_id: number; isbns: string[] };
    
    if (!body.book_shelf_id || !body.isbns?.length) {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    return HttpResponse.json({ success: true });
  }),

  // メモ作成
  http.post('/api/memo/create', async ({ request }) => {
    const body = await request.json() as { isbn: string; memo: string };
    
    if (!body.isbn || !body.memo) {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    return HttpResponse.json({
      memo: {
        id: 99,
        isbn: body.isbn,
        memo: body.memo,
        created_at: new Date().toISOString(),
      },
    }, { status: 201 });
  }),

  // 認証エラーのシミュレーション
  http.get('/api/books/favorite-status-unauthorized', () => {
    return HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
  }),
];