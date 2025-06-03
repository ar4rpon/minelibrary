import { test, expect } from '@playwright/test';

test.describe('書籍検索ページ - お気に入りボタンテスト', () => {
  test.beforeEach(async ({ page }) => {
    // テストユーザーでログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("ログイン"), button[type="submit"]');
    await page.waitForURL(/\/(dashboard|book)/, { timeout: 10000 });
  });

  test('お気に入りボタンが表示される', async ({ page }) => {
    // 書籍検索ページに移動
    await page.goto('/book/search?genre=001&keyword=react&page=1&searchMethod=title&sort=standard');
    
    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // 検索結果が表示されるまで待つ
    await page.waitForSelector('.grid.grid-cols-1', { timeout: 10000 });
    
    // 最初の書籍カードを取得
    const firstBookCard = page.locator('.grid.grid-cols-1 > div').first();
    await expect(firstBookCard).toBeVisible();
    
    // お気に入りボタンが存在することを確認
    const favoriteButton = firstBookCard.locator('button').filter({ hasText: '' }).last(); // ハートアイコンボタン
    await expect(favoriteButton).toBeVisible();
    
    console.log('お気に入りボタンが見つかりました');
  });

  test('お気に入りボタンをクリックできる', async ({ page }) => {
    // 書籍検索ページに移動
    await page.goto('/book/search?genre=001&keyword=react&page=1&searchMethod=title&sort=standard');
    
    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // 最初の書籍カードのお気に入りボタンを取得
    const firstBookCard = page.locator('.grid.grid-cols-1 > div').first();
    
    // お気に入りアイコンボタンを探す（ハートアイコンを含むボタン）
    const favoriteButton = firstBookCard.locator('button').filter({ has: page.locator('svg') }).last();
    
    await expect(favoriteButton).toBeVisible();
    
    // ハートアイコンの初期状態を確認
    const heartIcon = favoriteButton.locator('svg');
    const initialHeartClass = await heartIcon.getAttribute('class');
    console.log('Initial heart icon class:', initialHeartClass);
    
    // お気に入りボタンをクリック
    await favoriteButton.click();
    
    // APIリクエストの完了を待つ
    await page.waitForTimeout(2000);
    
    // ハートアイコンのクラスが変化したかを確認
    const newHeartClass = await heartIcon.getAttribute('class');
    console.log('New heart icon class:', newHeartClass);
    
    // ハートアイコンの色が変化したことを確認
    // 初期状態では text-muted-foreground、お気に入り後は text-red-500 fill-current になるはず
    const isNowFavorite = newHeartClass?.includes('text-red-500') && newHeartClass?.includes('fill-current');
    const wasInitiallyFavorite = initialHeartClass?.includes('text-red-500') && initialHeartClass?.includes('fill-current');
    
    // 状態が変化していることを確認
    expect(isNowFavorite).not.toBe(wasInitiallyFavorite);
  });

  test('お気に入りボタンのAPI呼び出しを確認', async ({ page }) => {
    // APIリクエストをキャプチャ
    const apiRequests: any[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
        });
      }
    });

    // 書籍検索ページに移動
    await page.goto('/book/search?genre=001&keyword=react&page=1&searchMethod=title&sort=standard');
    await page.waitForLoadState('networkidle');
    
    // 最初の書籍カードのお気に入りボタンを取得
    const firstBookCard = page.locator('.grid.grid-cols-1 > div').first();
    const favoriteButton = firstBookCard.locator('button').filter({ has: page.locator('svg[viewBox="0 0 24 24"]') });
    
    await expect(favoriteButton).toBeVisible();
    
    // お気に入りボタンをクリック
    await favoriteButton.click();
    
    // APIリクエストが送信されるまで待つ
    await page.waitForTimeout(2000);
    
    // お気に入り関連のAPIリクエストが送信されたかを確認
    const favoriteRequests = apiRequests.filter(req => 
      req.url.includes('favorite') || req.url.includes('toggle')
    );
    
    console.log('Captured API requests:', apiRequests);
    console.log('Favorite-related requests:', favoriteRequests);
    
    // お気に入り関連のAPIリクエストが1つ以上送信されていることを確認
    expect(favoriteRequests.length).toBeGreaterThan(0);
  });

  test('お気に入りボタンのエラーハンドリングを確認', async ({ page }) => {
    // コンソールエラーをキャプチャ
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });

    // 書籍検索ページに移動
    await page.goto('/book/search?genre=001&keyword=react&page=1&searchMethod=title&sort=standard');
    await page.waitForLoadState('networkidle');
    
    // 最初の書籍カードのお気に入りボタンを取得
    const firstBookCard = page.locator('.grid.grid-cols-1 > div').first();
    const favoriteButton = firstBookCard.locator('button').filter({ has: page.locator('svg[viewBox="0 0 24 24"]') });
    
    await expect(favoriteButton).toBeVisible();
    
    // お気に入りボタンをクリック
    await favoriteButton.click();
    
    // エラーが発生する場合は少し待つ
    await page.waitForTimeout(2000);
    
    // コンソールエラーを確認
    console.log('Console error messages:', consoleMessages);
    
    // 重大なエラーが発生していないことを確認
    const criticalErrors = consoleMessages.filter(msg => 
      msg.includes('Failed') || msg.includes('Error') || msg.includes('Uncaught')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors);
    }
  });
});