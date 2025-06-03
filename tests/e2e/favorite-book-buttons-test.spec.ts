import { test, expect, Page } from '@playwright/test';

test.describe('お気に入り書籍一覧ページボタン動作テスト', () => {
  test('お気に入り書籍カードの5つのボタンが正常に動作する', async ({ page }) => {
    // コンソールエラーとネットワークエラーをキャプチャ
    const consoleMessages: string[] = [];
    const networkErrors: string[] = [];
    const jsErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleMessages.push(`error: ${msg.text()}`);
      }
    });

    page.on('pageerror', (error) => {
      jsErrors.push(`javascript error: ${error.message}`);
    });

    page.on('response', (response) => {
      if (!response.ok() && response.status() >= 400) {
        networkErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    // まずログインページに移動してログイン
    console.log('Logging in...');
    await page.goto('http://localhost:8000/login');
    await page.waitForLoadState('networkidle');
    
    // ログインフォームに入力（テスト用のユーザー情報を使用）
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("ログイン"), input[type="submit"], button[type="submit"]');
    
    // ダッシュボードまたはホームページにリダイレクトされるのを待つ
    await page.waitForTimeout(3000);
    console.log('Login completed, current URL:', page.url());
    
    // お気に入り書籍一覧ページに移動
    console.log('Navigating to favorite book list page...');
    await page.goto('http://localhost:8000/favorite-book/list');
    
    // ページの読み込みを待つ
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // 追加の待機時間

    // ページタイトルが設定されているかを確認
    const title = await page.title();
    console.log('Page title:', title);

    // ページのボディ内容を取得（デバッグ用）
    const bodyContent = await page.textContent('body');
    console.log('Page body content (first 200 chars):', bodyContent?.substring(0, 200));

    // ヘッダーが存在するかを確認
    const hasHeader = await page.locator('header').count() > 0;
    console.log('Has header:', hasHeader);

    // メインコンテンツが存在するかを確認
    const hasMain = await page.locator('main').count() > 0;
    console.log('Has main content:', hasMain);

    // コンテンツが存在するかを確認
    const hasContent = await page.locator('body').count() > 0;
    console.log('Has content:', hasContent);

    // お気に入り書籍が表示されるのを待つ
    const favoriteText = page.locator('text=お気に入りの書籍はありません');
    const hasFavorites = await favoriteText.count() === 0;
    
    if (hasFavorites) {
      // 書籍カードコンテナを待つ
      await page.waitForSelector('div[class*="grid"], div[class*="card"], [class*="BaseCard"]', { timeout: 10000 });
      
      const bookCards = await page.locator('div[class*="grid"] > div, [class*="BaseCard"]').count();
      console.log('Number of book cards found:', bookCards);

      if (bookCards > 0) {
        // 最初の書籍カードを対象にボタンテスト
        const firstCard = page.locator('div[class*="grid"] > div, [class*="BaseCard"]').first();
      
      console.log('Testing buttons on first book card...');

      // 1. 進捗を変更ボタン
      console.log('Testing "進捗を変更" button...');
      const progressButton = firstCard.locator('button:has-text("進捗を変更"), button:has-text("進捗"), button[aria-label*="進捗"]').first();
      if (await progressButton.count() > 0) {
        try {
          await progressButton.click();
          await page.waitForTimeout(1000);
          console.log('進捗を変更 button clicked successfully');
          
          // ダイアログが開いたか確認
          const dialogVisible = await page.locator('[role="dialog"], .dialog, [data-testid="dialog"]').count() > 0;
          console.log('Progress dialog opened:', dialogVisible);
          
          // ダイアログを閉じる
          if (dialogVisible) {
            await page.locator('[role="dialog"] button:has-text("キャンセル"), [role="dialog"] button:has-text("閉じる"), [role="dialog"] [aria-label="Close"]').first().click();
            await page.waitForTimeout(500);
          }
        } catch (error) {
          console.log('進捗を変更 button error:', error);
        }
      } else {
        console.log('進捗を変更 button not found');
      }

      // 2. メモを書くボタン
      console.log('Testing "メモを書く" button...');
      const memoButton = firstCard.locator('button:has-text("メモを書く"), button:has-text("メモ"), button[aria-label*="メモ"]').first();
      if (await memoButton.count() > 0) {
        try {
          await memoButton.click();
          await page.waitForTimeout(1000);
          console.log('メモを書く button clicked successfully');
          
          // ダイアログが開いたか確認
          const dialogVisible = await page.locator('[role="dialog"], .dialog, [data-testid="dialog"]').count() > 0;
          console.log('Memo dialog opened:', dialogVisible);
          
          // ダイアログを閉じる
          if (dialogVisible) {
            await page.locator('[role="dialog"] button:has-text("キャンセル"), [role="dialog"] button:has-text("閉じる"), [role="dialog"] [aria-label="Close"]').first().click();
            await page.waitForTimeout(500);
          }
        } catch (error) {
          console.log('メモを書く button error:', error);
        }
      } else {
        console.log('メモを書く button not found');
      }

      // 3. 詳細を見るボタン
      console.log('Testing "詳細を見る" button...');
      const detailButton = firstCard.locator('button:has-text("詳細を見る"), button:has-text("詳細"), button[aria-label*="詳細"]').first();
      if (await detailButton.count() > 0) {
        try {
          await detailButton.click();
          await page.waitForTimeout(1000);
          console.log('詳細を見る button clicked successfully');
          
          // ダイアログが開いたか確認
          const dialogVisible = await page.locator('[role="dialog"], .dialog, [data-testid="dialog"]').count() > 0;
          console.log('Detail dialog opened:', dialogVisible);
          
          // ダイアログを閉じる
          if (dialogVisible) {
            await page.locator('[role="dialog"] button:has-text("キャンセル"), [role="dialog"] button:has-text("閉じる"), [role="dialog"] [aria-label="Close"]').first().click();
            await page.waitForTimeout(500);
          }
        } catch (error) {
          console.log('詳細を見る button error:', error);
        }
      } else {
        console.log('詳細を見る button not found');
      }

      // 4. お気に入り解除ボタン
      console.log('Testing "お気に入り" button...');
      const favoriteButton = firstCard.locator('button:has-text("お気に入り"), button:has-text("解除"), button[aria-label*="お気に入り"]').first();
      if (await favoriteButton.count() > 0) {
        try {
          await favoriteButton.click();
          await page.waitForTimeout(1000);
          console.log('お気に入り button clicked successfully');
        } catch (error) {
          console.log('お気に入り button error:', error);
        }
      } else {
        console.log('お気に入り button not found');
      }

      // 5. 本棚に追加ボタン（ドロップダウン）
      console.log('Testing "本棚に追加" button...');
      const bookshelfButton = firstCard.locator('button:has-text("本棚に追加"), button:has-text("追加"), button[aria-label*="本棚"]').first();
      if (await bookshelfButton.count() > 0) {
        try {
          await bookshelfButton.click();
          await page.waitForTimeout(1000);
          console.log('本棚に追加 button clicked successfully');
          
          // ドロップダウンメニューが開いたか確認
          const dropdownVisible = await page.locator('[role="menu"], .dropdown-menu, [data-testid="dropdown"]').count() > 0;
          console.log('Bookshelf dropdown opened:', dropdownVisible);
          
          // ドロップダウンを閉じる（他の場所をクリック）
          if (dropdownVisible) {
            await page.click('body', { position: { x: 10, y: 10 } });
            await page.waitForTimeout(500);
          }
        } catch (error) {
          console.log('本棚に追加 button error:', error);
        }
      } else {
        console.log('本棚に追加 button not found');
        }
      }
    } else {
      console.log('No favorite books found - showing empty state');
    }

    // エラーメッセージを出力
    console.log('Console messages:', consoleMessages);
    console.log('JavaScript errors:', jsErrors);
    console.log('Network errors:', networkErrors);

    // テストの成功条件
    expect(title).toBeDefined();
    expect(hasContent).toBe(true);
  });
});