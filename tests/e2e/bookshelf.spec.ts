import { test, expect } from '@playwright/test';

test.describe('本棚機能', () => {
  test.beforeEach(async ({ page }) => {
    // 事前にログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("ログイン")');
    
    // ダッシュボードに移動
    await page.goto('/dashboard');
  });

  test('本棚一覧の表示', async ({ page }) => {
    // 本棚一覧ページに移動
    await page.click('text=本棚');
    await expect(page).toHaveURL('/bookshelf');

    // 本棚作成ボタンが表示されることを確認
    await expect(page.locator('button:has-text("本棚を作成")')).toBeVisible();

    // 既存の本棚が表示されることを確認（データベースに本棚がある場合）
    const bookShelves = page.locator('[data-testid="bookshelf-card"]');
    const bookShelfCount = await bookShelves.count();
    
    if (bookShelfCount > 0) {
      await expect(bookShelves.first()).toBeVisible();
    }
  });

  test('新しい本棚の作成', async ({ page }) => {
    await page.goto('/bookshelf');

    // 本棚作成ボタンをクリック
    await page.click('button:has-text("本棚を作成")');

    // 作成ダイアログが表示されることを確認
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('h2:has-text("本棚を作成")')).toBeVisible();

    // 本棚情報を入力
    const timestamp = Date.now();
    const bookShelfName = `テスト本棚_${timestamp}`;
    const bookShelfDescription = `テスト用の本棚です_${timestamp}`;

    await page.fill('input[name="book_shelf_name"]', bookShelfName);
    await page.fill('textarea[name="book_shelf_description"]', bookShelfDescription);

    // 作成ボタンをクリック
    await page.click('button:has-text("作成")');

    // ダイアログが閉じることを確認
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // 新しい本棚が一覧に表示されることを確認
    await expect(page.locator(`text=${bookShelfName}`)).toBeVisible();
  });

  test('本棚の詳細表示', async ({ page }) => {
    await page.goto('/bookshelf');

    // 既存の本棚をクリック（最初の本棚）
    const bookShelfCards = page.locator('[data-testid="bookshelf-card"]');
    const bookShelfCount = await bookShelfCards.count();

    if (bookShelfCount > 0) {
      await bookShelfCards.first().click();

      // 本棚詳細ページに移動することを確認
      await expect(page.url()).toContain('/bookshelf/');

      // 詳細ページの要素が表示されることを確認
      await expect(page.locator('h1')).toBeVisible(); // 本棚名
      await expect(page.locator('button:has-text("本を追加")')).toBeVisible();
      await expect(page.locator('button:has-text("共有リンクを作成")')).toBeVisible();
    }
  });

  test('本棚に本を追加', async ({ page }) => {
    // 本棚詳細ページに移動（最初の本棚）
    await page.goto('/bookshelf');
    const bookShelfCards = page.locator('[data-testid="bookshelf-card"]');
    const bookShelfCount = await bookShelfCards.count();

    if (bookShelfCount > 0) {
      await bookShelfCards.first().click();

      // 本を追加ボタンをクリック
      await page.click('button:has-text("本を追加")');

      // 追加ダイアログが表示されることを確認
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('h2:has-text("本を追加")')).toBeVisible();

      // 書籍検索フォームが表示されることを確認
      await expect(page.locator('input[placeholder*="ISBN"]')).toBeVisible();
      await expect(page.locator('button:has-text("検索")')).toBeVisible();

      // ISBN検索を実行
      await page.fill('input[placeholder*="ISBN"]', '9784798142470');
      await page.click('button:has-text("検索")');

      // 検索結果が表示されるまで待機
      await page.waitForTimeout(2000);

      // 追加ボタンが表示される場合はクリック
      const addButtons = page.locator('button:has-text("追加")');
      const addButtonCount = await addButtons.count();

      if (addButtonCount > 0) {
        await addButtons.first().click();

        // ダイアログが閉じることを確認
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
      }
    }
  });

  test('本棚の編集', async ({ page }) => {
    await page.goto('/bookshelf');
    const bookShelfCards = page.locator('[data-testid="bookshelf-card"]');
    const bookShelfCount = await bookShelfCards.count();

    if (bookShelfCount > 0) {
      await bookShelfCards.first().click();

      // 編集ボタンをクリック（ドロップダウンメニュー内）
      await page.click('[data-testid="bookshelf-menu"]');
      await page.click('text=編集');

      // 編集ダイアログが表示されることを確認
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('h2:has-text("本棚を編集")')).toBeVisible();

      // 本棚名を更新
      const timestamp = Date.now();
      const updatedName = `更新された本棚_${timestamp}`;

      await page.fill('input[name="book_shelf_name"]', updatedName);

      // 更新ボタンをクリック
      await page.click('button:has-text("更新")');

      // ダイアログが閉じることを確認
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // 更新された名前が表示されることを確認
      await expect(page.locator(`text=${updatedName}`)).toBeVisible();
    }
  });

  test('共有リンクの作成', async ({ page }) => {
    await page.goto('/bookshelf');
    const bookShelfCards = page.locator('[data-testid="bookshelf-card"]');
    const bookShelfCount = await bookShelfCards.count();

    if (bookShelfCount > 0) {
      await bookShelfCards.first().click();

      // 共有リンク作成ボタンをクリック
      await page.click('button:has-text("共有リンクを作成")');

      // 共有リンクダイアログが表示されることを確認
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('h2:has-text("共有リンクを作成")')).toBeVisible();

      // 共有設定を選択
      await page.selectOption('select[name="permission"]', 'view');

      // 作成ボタンをクリック
      await page.click('button:has-text("作成")');

      // 共有リンクが生成されることを確認
      await expect(page.locator('input[readonly]')).toBeVisible();
      await expect(page.locator('button:has-text("コピー")')).toBeVisible();
    }
  });

  test('本棚から本を削除', async ({ page }) => {
    await page.goto('/bookshelf');
    const bookShelfCards = page.locator('[data-testid="bookshelf-card"]');
    const bookShelfCount = await bookShelfCards.count();

    if (bookShelfCount > 0) {
      await bookShelfCards.first().click();

      // 本棚に本がある場合のテスト
      const bookCards = page.locator('[data-testid="book-card"]');
      const bookCount = await bookCards.count();

      if (bookCount > 0) {
        // 最初の本のメニューを開く
        await bookCards.first().locator('[data-testid="book-menu"]').click();
        await page.click('text=削除');

        // 削除確認ダイアログが表示されることを確認
        await expect(page.locator('[role="dialog"]')).toBeVisible();
        await expect(page.locator('text=本当に削除しますか')).toBeVisible();

        // 削除を実行
        await page.click('button:has-text("削除")');

        // ダイアログが閉じることを確認
        await expect(page.locator('[role="dialog"]')).not.toBeVisible();
      }
    }
  });

  test('本棚の削除', async ({ page }) => {
    // まず新しい本棚を作成してテスト用にする
    await page.goto('/bookshelf');
    await page.click('button:has-text("本棚を作成")');

    const timestamp = Date.now();
    const testBookShelfName = `削除テスト本棚_${timestamp}`;
    
    await page.fill('input[name="book_shelf_name"]', testBookShelfName);
    await page.fill('textarea[name="book_shelf_description"]', '削除テスト用');
    await page.click('button:has-text("作成")');

    // 作成した本棚をクリック
    await page.click(`text=${testBookShelfName}`);

    // 削除メニューを開く
    await page.click('[data-testid="bookshelf-menu"]');
    await page.click('text=削除');

    // 削除確認ダイアログが表示されることを確認
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=本当に削除しますか')).toBeVisible();

    // 削除を実行
    await page.click('button:has-text("削除")');

    // 本棚一覧ページにリダイレクトされることを確認
    await expect(page).toHaveURL('/bookshelf');

    // 削除された本棚が一覧に表示されないことを確認
    await expect(page.locator(`text=${testBookShelfName}`)).not.toBeVisible();
  });
});