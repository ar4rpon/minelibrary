import { test, expect } from '@playwright/test';

test.describe('メモ機能', () => {
  test.beforeEach(async ({ page }) => {
    // 事前にログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("ログイン")');
  });

  test('メモ一覧の表示', async ({ page }) => {
    // メモ一覧ページに移動
    await page.goto('/memo');

    // メモ作成ボタンが表示されることを確認
    await expect(page.locator('button:has-text("メモを作成")')).toBeVisible();

    // 既存のメモが表示されることを確認（データベースにメモがある場合）
    const memos = page.locator('[data-testid="memo-card"]');
    const memoCount = await memos.count();
    
    if (memoCount > 0) {
      await expect(memos.first()).toBeVisible();
    }
  });

  test('新しいメモの作成', async ({ page }) => {
    await page.goto('/memo');

    // メモ作成ボタンをクリック
    await page.click('button:has-text("メモを作成")');

    // 作成ダイアログが表示されることを確認
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('h2:has-text("メモを作成")')).toBeVisible();

    // メモ情報を入力
    const timestamp = Date.now();
    const memoContent = `テストメモ内容_${timestamp}`;

    await page.fill('input[name="memo_title"]', `テストメモ_${timestamp}`);
    await page.fill('textarea[name="memo"]', memoContent);

    // ISBNを入力（書籍と関連付け）
    await page.fill('input[name="isbn"]', '9784798142470');

    // 章とページを入力
    await page.fill('input[name="memo_chapter"]', '1');
    await page.fill('input[name="memo_page"]', '10');

    // 作成ボタンをクリック
    await page.click('button:has-text("作成")');

    // ダイアログが閉じることを確認
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // 新しいメモが一覧に表示されることを確認
    await expect(page.locator(`text=${memoContent}`)).toBeVisible();
  });

  test('メモの編集', async ({ page }) => {
    await page.goto('/memo');

    // 既存のメモがある場合のテスト
    const memoCards = page.locator('[data-testid="memo-card"]');
    const memoCount = await memoCards.count();

    if (memoCount > 0) {
      // 最初のメモの編集ボタンをクリック
      await memoCards.first().locator('button:has-text("編集")').click();

      // 編集ダイアログが表示されることを確認
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      await expect(page.locator('h2:has-text("メモを編集")')).toBeVisible();

      // メモ内容を更新
      const timestamp = Date.now();
      const updatedContent = `更新されたメモ内容_${timestamp}`;

      await page.fill('textarea[name="memo"]', updatedContent);

      // 更新ボタンをクリック
      await page.click('button:has-text("更新")');

      // ダイアログが閉じることを確認
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // 更新された内容が表示されることを確認
      await expect(page.locator(`text=${updatedContent}`)).toBeVisible();
    }
  });

  test('メモの削除', async ({ page }) => {
    // まず新しいメモを作成してテスト用にする
    await page.goto('/memo');
    await page.click('button:has-text("メモを作成")');

    const timestamp = Date.now();
    const testMemoContent = `削除テストメモ_${timestamp}`;
    
    await page.fill('input[name="memo_title"]', `削除テスト_${timestamp}`);
    await page.fill('textarea[name="memo"]', testMemoContent);
    await page.fill('input[name="isbn"]', '9784798142470');
    await page.click('button:has-text("作成")');

    // 作成したメモの削除ボタンをクリック
    const testMemoCard = page.locator(`text=${testMemoContent}`).locator('..').locator('..');
    await testMemoCard.locator('button:has-text("削除")').click();

    // 削除確認ダイアログが表示されることを確認
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=本当に削除しますか')).toBeVisible();

    // 削除を実行
    await page.click('button:has-text("削除")');

    // ダイアログが閉じることを確認
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();

    // 削除されたメモが一覧に表示されないことを確認
    await expect(page.locator(`text=${testMemoContent}`)).not.toBeVisible();
  });

  test('メモの検索とフィルタリング', async ({ page }) => {
    await page.goto('/memo');

    // 検索フォームが表示されることを確認
    const searchInput = page.locator('input[placeholder*="検索"]');
    if (await searchInput.isVisible()) {
      // 検索キーワードを入力
      await searchInput.fill('JavaScript');

      // 検索ボタンをクリック（存在する場合）
      const searchButton = page.locator('button:has-text("検索")');
      if (await searchButton.isVisible()) {
        await searchButton.click();
      }

      // 検索結果が表示されるまで待機
      await page.waitForTimeout(1000);

      // 検索結果が適切にフィルタリングされることを確認
      const memoCards = page.locator('[data-testid="memo-card"]');
      const memoCount = await memoCards.count();

      if (memoCount > 0) {
        // 各メモカードに検索キーワードが含まれることを確認
        for (let i = 0; i < memoCount; i++) {
          const memoCard = memoCards.nth(i);
          const content = await memoCard.textContent();
          expect(content?.toLowerCase()).toContain('javascript');
        }
      }
    }
  });

  test('書籍詳細からのメモ表示', async ({ page }) => {
    // 書籍検索ページでメモ付きの書籍を検索
    await page.goto('/book/search');

    // 検索を実行
    await page.fill('input[placeholder*="キーワード"]', 'プログラミング');
    await page.click('button:has-text("検索")');

    // 検索結果が表示されるまで待機
    await page.waitForTimeout(2000);

    // 詳細ボタンが存在する場合
    const detailButtons = page.locator('button:has-text("詳細を見る")');
    const buttonCount = await detailButtons.count();

    if (buttonCount > 0) {
      // 最初の詳細ボタンをクリック
      await detailButtons.first().click();

      // ダイアログが表示されることを確認
      await expect(page.locator('[role="dialog"]')).toBeVisible();

      // メモセクションが表示されることを確認
      await expect(page.locator('h3:has-text("ユーザーのメモ・感想")')).toBeVisible();

      // メモが表示される場合のテスト
      const memoElements = page.locator('[data-testid="memo-item"]');
      const memoElementCount = await memoElements.count();

      if (memoElementCount > 0) {
        // メモ内容が表示されることを確認
        await expect(memoElements.first()).toBeVisible();
      } else {
        // メモがない場合のメッセージが表示されることを確認
        await expect(page.locator('text=まだメモがありません')).toBeVisible();
      }
    }
  });

  test('メモの並び替えとページネーション', async ({ page }) => {
    await page.goto('/memo');

    // 並び替えセレクトボックスが存在する場合
    const sortSelect = page.locator('select[name="sort"]');
    if (await sortSelect.isVisible()) {
      // 作成日順で並び替え
      await sortSelect.selectOption('created_at');

      // 並び替えが反映されるまで待機
      await page.waitForTimeout(1000);

      // URLに並び替えパラメータが含まれることを確認
      await expect(page.url()).toContain('sort=created_at');
    }

    // ページネーションが存在する場合
    const pagination = page.locator('[data-testid="pagination"]');
    if (await pagination.isVisible()) {
      const nextButton = page.locator('button:has-text("次へ")');
      if (await nextButton.isVisible() && await nextButton.isEnabled()) {
        // 次のページに移動
        await nextButton.click();

        // ページが変わることを確認
        await page.waitForTimeout(1000);
        await expect(page.url()).toContain('page=2');
      }
    }
  });

  test('メモのエクスポート機能', async ({ page }) => {
    await page.goto('/memo');

    // エクスポートボタンが存在する場合
    const exportButton = page.locator('button:has-text("エクスポート")');
    if (await exportButton.isVisible()) {
      // エクスポートボタンをクリック
      await exportButton.click();

      // エクスポート形式選択ダイアログが表示される場合
      const exportDialog = page.locator('[role="dialog"]:has-text("エクスポート")');
      if (await exportDialog.isVisible()) {
        // CSV形式を選択
        await page.click('button:has-text("CSV")');

        // ダウンロードが開始されることを確認
        const downloadPromise = page.waitForEvent('download');
        await page.click('button:has-text("ダウンロード")');
        const download = await downloadPromise;

        // ダウンロードファイル名を確認
        expect(download.suggestedFilename()).toContain('.csv');
      }
    }
  });
});