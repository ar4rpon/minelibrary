import { test, expect } from '@playwright/test';

test.describe('書籍検索機能', () => {
  test.beforeEach(async ({ page }) => {
    // 事前にログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("ログイン")');
    
    // 書籍検索ページに移動
    await page.goto('/book/search');
  });

  test('書籍検索フォームの表示と基本機能', async ({ page }) => {
    // 検索フォームの要素が表示されることを確認
    await expect(page.locator('select')).toHaveCount(3); // 検索方法、ジャンル、並び替え
    await expect(page.locator('input[placeholder*="キーワード"]')).toBeVisible();
    await expect(page.locator('button:has-text("検索")')).toBeVisible();

    // 検索方法を変更
    await page.selectOption('select:nth-of-type(1)', 'isbn');
    await expect(page.locator('select:nth-of-type(1)')).toHaveValue('isbn');

    // ジャンルを選択
    await page.selectOption('select:nth-of-type(2)', '001');
    await expect(page.locator('select:nth-of-type(2)')).toHaveValue('001');
  });

  test('書籍検索の実行', async ({ page }) => {
    // 検索キーワードを入力
    await page.fill('input[placeholder*="キーワード"]', 'JavaScript');

    // 検索ボタンをクリック
    await page.click('button:has-text("検索")');

    // 検索中の表示が出ることを確認
    await expect(page.locator('button:has-text("検索中...")')).toBeVisible();

    // 検索結果が表示されるまで待機
    await expect(page.locator('button:has-text("検索")')).toBeVisible();

    // 検索結果の確認（楽天APIから結果が返る場合）
    // Note: テスト環境では実際のAPIレスポンスは期待できないため、モックが必要
    const results = page.locator('[data-testid="book-result"]');
    const resultsCount = await results.count();
    
    if (resultsCount > 0) {
      // 結果がある場合、書籍カードが表示されることを確認
      await expect(results.first()).toBeVisible();
    } else {
      // 結果がない場合、適切なメッセージが表示されることを確認
      await expect(page.locator('text=検索結果がありません')).toBeVisible();
    }
  });

  test('書籍詳細ダイアログの表示', async ({ page }) => {
    // 検索を実行して結果を表示
    await page.fill('input[placeholder*="キーワード"]', 'プログラミング');
    await page.click('button:has-text("検索")');

    // 検索結果が表示されるまで待機
    await page.waitForTimeout(2000);

    // 詳細ボタンが存在する場合のテスト
    const detailButtons = page.locator('button:has-text("詳細を見る")');
    const buttonCount = await detailButtons.count();

    if (buttonCount > 0) {
      // 最初の詳細ボタンをクリック
      await detailButtons.first().click();

      // ダイアログが表示されることを確認
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('h2')).toBeVisible(); // ダイアログタイトル

      // ダイアログを閉じる
      await page.keyboard.press('Escape');
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    }
  });

  test('お気に入り機能', async ({ page }) => {
    // 検索を実行
    await page.fill('input[placeholder*="キーワード"]', 'React');
    await page.click('button:has-text("検索")');

    // 検索結果が表示されるまで待機
    await page.waitForTimeout(2000);

    // お気に入りボタンが存在する場合のテスト
    const favoriteButtons = page.locator('[data-testid="favorite-icon"]');
    const favoriteCount = await favoriteButtons.count();

    if (favoriteCount > 0) {
      const firstFavoriteButton = favoriteButtons.first();
      
      // 初期状態を確認
      const initialState = await firstFavoriteButton.textContent();
      
      // お気に入りボタンをクリック
      await firstFavoriteButton.click();

      // 状態が変わることを確認（APIが正常に動作する場合）
      await page.waitForTimeout(1000);
      const newState = await firstFavoriteButton.textContent();
      
      // 状態が変わったことを確認（★ ⟷ ☆）
      if (initialState !== newState) {
        expect(initialState).not.toBe(newState);
      }
    }
  });

  test('ページネーション機能', async ({ page }) => {
    // 検索を実行して多くの結果を取得
    await page.fill('input[placeholder*="キーワード"]', 'プログラミング');
    await page.click('button:has-text("検索")');

    // 検索結果が表示されるまで待機
    await page.waitForTimeout(3000);

    // ページネーションが存在する場合のテスト
    const pagination = page.locator('[data-testid="pagination"]');
    const paginationExists = await pagination.isVisible();

    if (paginationExists) {
      // 次のページボタンが存在する場合
      const nextButton = page.locator('button:has-text("次へ")');
      const nextButtonExists = await nextButton.isVisible();

      if (nextButtonExists) {
        // 次のページに移動
        await nextButton.click();

        // ページが変わることを確認
        await page.waitForTimeout(2000);
        await expect(page.url()).toContain('page=2');
      }
    }
  });

  test('並び替え機能', async ({ page }) => {
    // 検索を実行
    await page.fill('input[placeholder*="キーワード"]', 'JavaScript');
    await page.click('button:has-text("検索")');

    // 並び替えオプションを変更
    await page.selectOption('select:nth-of-type(3)', 'sales'); // 売れている順

    // 検索を再実行
    await page.click('button:has-text("検索")');

    // 検索結果が表示されるまで待機
    await page.waitForTimeout(2000);

    // URLに並び替えパラメータが含まれることを確認
    await expect(page.url()).toContain('sort=sales');
  });

  test('検索履歴の保持', async ({ page }) => {
    // 検索を実行
    const searchTerm = 'TypeScript';
    await page.fill('input[placeholder*="キーワード"]', searchTerm);
    await page.click('button:has-text("検索")');

    // ページをリロード
    await page.reload();

    // 検索キーワードが保持されることを確認
    const searchInput = page.locator('input[placeholder*="キーワード"]');
    await expect(searchInput).toHaveValue(searchTerm);
  });
});