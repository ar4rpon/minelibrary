import { test, expect } from '@playwright/test';

test.describe('書籍検索ページ - 書籍詳細ダイアログテスト', () => {
  test.beforeEach(async ({ page }) => {
    // 認証セッションを手動で設定してスキップ
    await page.goto('/login');
    
    // テストユーザーでログイン（開発環境用）
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    
    // ログインボタンをクリック
    await page.click('button:has-text("ログイン"), button[type="submit"]');
    
    // ログイン成功まで待つ（ダッシュボードまたはリダイレクト先）
    await page.waitForURL(/\/(dashboard|book)/, { timeout: 10000 });
  });

  test('書籍検索ページで書籍詳細ダイアログが表示される', async ({ page }) => {
    // 書籍検索ページに移動
    await page.goto('/book/search?genre=001&keyword=react&page=1&searchMethod=title&sort=standard');
    
    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // 検索結果が表示されるまで待つ
    await page.waitForSelector('.grid.grid-cols-1', { timeout: 10000 });
    
    // 最初の書籍カードが存在することを確認
    const firstBookCard = page.locator('.grid.grid-cols-1 > div').first();
    await expect(firstBookCard).toBeVisible();
    
    // 「詳細を見る」ボタンが存在することを確認
    const detailButton = firstBookCard.locator('button:has-text("詳細を見る")');
    await expect(detailButton).toBeVisible();
    
    // 「詳細を見る」ボタンをクリック
    await detailButton.click();
    
    // ダイアログが表示されるまで待つ
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
    
    // ダイアログが表示されることを確認
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    
    // ダイアログ内にタイトル「詳細」が表示されることを確認
    await expect(dialog.getByRole('heading', { name: '詳細' })).toBeVisible();
    
    // ESCキーでダイアログを閉じる
    await page.keyboard.press('Escape');
    
    // ダイアログが閉じられることを確認
    await expect(dialog).not.toBeVisible();
  });

  test('書籍詳細ダイアログでメモ機能が動作する', async ({ page }) => {
    // 書籍検索ページに移動
    await page.goto('/book/search?genre=001&keyword=react&page=1&searchMethod=title&sort=standard');
    
    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // 最初の書籍の詳細ダイアログを開く
    const firstBookCard = page.locator('.grid.grid-cols-1 > div').first();
    const detailButton = firstBookCard.locator('button:has-text("詳細を見る")');
    await detailButton.click();
    
    // ダイアログが表示されるまで待つ
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    
    // メモセクションが存在することを確認
    await expect(dialog.locator('text=ユーザーのメモ・感想')).toBeVisible();
    
    // メモコンテンツ領域が表示されることを確認
    await expect(dialog.locator('text=まだメモがありません。')).toBeVisible();
  });

  test('書籍詳細ダイアログで Amazon/楽天ボタンが動作する', async ({ page }) => {
    // 書籍検索ページに移動
    await page.goto('/book/search?genre=001&keyword=react&page=1&searchMethod=title&sort=standard');
    
    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // 最初の書籍の詳細ダイアログを開く
    const firstBookCard = page.locator('.grid.grid-cols-1 > div').first();
    const detailButton = firstBookCard.locator('button:has-text("詳細を見る")');
    await detailButton.click();
    
    // ダイアログが表示されるまで待つ
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    
    // 「書籍を探す」セクションが存在することを確認
    await expect(dialog.locator('text=書籍を探す')).toBeVisible();
    
    // Amazon、楽天ボタン（アイコンボタン）が存在することを確認
    const amazonButton = dialog.locator('button').filter({ has: page.locator('svg') }).first();
    const rakutenButton = dialog.locator('button').filter({ has: page.locator('svg') }).nth(1);
    
    await expect(amazonButton).toBeVisible();
    await expect(rakutenButton).toBeVisible();
  });
});