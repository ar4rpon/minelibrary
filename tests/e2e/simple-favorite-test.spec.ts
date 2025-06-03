import { test, expect } from '@playwright/test';

test.describe('お気に入り書籍一覧ページ簡単テスト', () => {
  test('お気に入り書籍ページが正常に表示され、ボタンが存在する', async ({ page }) => {
    // ログイン
    await page.goto('http://localhost:8000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("ログイン")');
    await page.waitForTimeout(2000);
    
    // お気に入り書籍一覧ページに移動
    await page.goto('http://localhost:8000/favorite-book/list');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // ページが正常に表示されているか確認
    const title = await page.title();
    expect(title).toContain('Laravel');
    
    // エラーがないか確認
    const errorText = await page.locator('text=Internal Server Error').count();
    expect(errorText).toBe(0);
    
    // 白画面ではないことを確認
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toBe('');
    expect(bodyText?.length).toBeGreaterThan(100);
    
    console.log('Page loaded successfully');
    console.log('Page title:', title);
    console.log('Body content length:', bodyText?.length);
    
    // お気に入り書籍があるかまたは「お気に入りの書籍はありません」が表示されているか
    const hasBooks = await page.locator('button:has-text("進捗を変更")').count() > 0;
    const hasEmptyMessage = await page.locator('text=お気に入りの書籍はありません').count() > 0;
    
    if (hasBooks) {
      console.log('Found favorite books with buttons');
      
      // 各ボタンが存在することを確認
      const progressButton = page.locator('button:has-text("進捗を変更")').first();
      const memoButton = page.locator('button:has-text("メモ")').first();
      const detailButton = page.locator('button:has-text("詳細")').first();
      const favoriteButton = page.locator('button:has-text("お気に入り"), button:has-text("解除")').first();
      const bookshelfButton = page.locator('button:has-text("追加"), button:has-text("本棚に追加")').first();
      
      expect(await progressButton.count()).toBeGreaterThan(0);
      expect(await memoButton.count()).toBeGreaterThan(0);
      expect(await detailButton.count()).toBeGreaterThan(0);
      expect(await favoriteButton.count()).toBeGreaterThan(0);
      expect(await bookshelfButton.count()).toBeGreaterThan(0);
      
      console.log('All 5 buttons found successfully');
    } else if (hasEmptyMessage) {
      console.log('No favorite books found - showing empty state (this is normal)');
    } else {
      console.log('Warning: Page loaded but no books or empty message found');
    }
    
    expect(hasBooks || hasEmptyMessage).toBe(true);
  });
});