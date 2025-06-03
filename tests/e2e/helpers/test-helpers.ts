import { Page, expect } from '@playwright/test';

/**
 * テスト用のヘルパー関数群
 */

/**
 * ログインを実行するヘルパー関数
 */
export async function loginAsTestUser(page: Page, email = 'test@example.com', password = 'password') {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button:has-text("ログイン")');
  await expect(page).toHaveURL('/dashboard');
}

/**
 * 新規ユーザーを登録するヘルパー関数
 */
export async function registerNewUser(page: Page) {
  await page.goto('/register');
  
  const timestamp = Date.now();
  const testEmail = `test${timestamp}@example.com`;
  
  await page.fill('input[name="name"]', `Test User ${timestamp}`);
  await page.fill('input[name="email"]', testEmail);
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="password_confirmation"]', 'password123');
  
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
  
  return { email: testEmail, password: 'password123' };
}

/**
 * 本棚を作成するヘルパー関数
 */
export async function createBookShelf(page: Page, name?: string, description?: string) {
  const timestamp = Date.now();
  const bookShelfName = name || `テスト本棚_${timestamp}`;
  const bookShelfDescription = description || `テスト用の本棚です_${timestamp}`;
  
  await page.goto('/bookshelf');
  await page.click('button:has-text("本棚を作成")');
  
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  
  await page.fill('input[name="book_shelf_name"]', bookShelfName);
  await page.fill('textarea[name="book_shelf_description"]', bookShelfDescription);
  
  await page.click('button:has-text("作成")');
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  
  return { name: bookShelfName, description: bookShelfDescription };
}

/**
 * メモを作成するヘルパー関数
 */
export async function createMemo(page: Page, content?: string, isbn?: string) {
  const timestamp = Date.now();
  const memoContent = content || `テストメモ内容_${timestamp}`;
  const memoIsbn = isbn || '9784798142470';
  
  await page.goto('/memo');
  await page.click('button:has-text("メモを作成")');
  
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  
  await page.fill('input[name="memo_title"]', `テストメモ_${timestamp}`);
  await page.fill('textarea[name="memo"]', memoContent);
  await page.fill('input[name="isbn"]', memoIsbn);
  
  await page.click('button:has-text("作成")');
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  
  return { content: memoContent, isbn: memoIsbn };
}

/**
 * 書籍検索を実行するヘルパー関数
 */
export async function searchBooks(page: Page, keyword: string, searchType = 'keyword') {
  await page.goto('/book/search');
  
  if (searchType !== 'keyword') {
    await page.selectOption('select:nth-of-type(1)', searchType);
  }
  
  await page.fill('input[placeholder*="キーワード"]', keyword);
  await page.click('button:has-text("検索")');
  
  // 検索結果が表示されるまで待機
  await page.waitForTimeout(2000);
}

/**
 * ダイアログが開いていることを確認するヘルパー関数
 */
export async function expectDialogToBeOpen(page: Page, title?: string) {
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  
  if (title) {
    await expect(page.locator(`h2:has-text("${title}")`)).toBeVisible();
  }
}

/**
 * ダイアログが閉じていることを確認するヘルパー関数
 */
export async function expectDialogToBeClosed(page: Page) {
  await expect(page.locator('[role="dialog"]')).not.toBeVisible();
}

/**
 * 要素が表示されるまで待機するヘルパー関数
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await page.waitForSelector(selector, { timeout });
  await expect(page.locator(selector)).toBeVisible();
}

/**
 * APIレスポンスを待機するヘルパー関数
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse(response => {
    if (typeof urlPattern === 'string') {
      return response.url().includes(urlPattern);
    }
    return urlPattern.test(response.url());
  });
}

/**
 * ページのパフォーマンス指標を取得するヘルパー関数
 */
export async function getPerformanceMetrics(page: Page) {
  return page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');
    
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
    };
  });
}

/**
 * フォームバリデーションエラーをチェックするヘルパー関数
 */
export async function expectValidationError(page: Page, fieldName: string, errorMessage?: string) {
  const errorElement = page.locator(`[data-testid="${fieldName}-error"], .error-message:near(input[name="${fieldName}"])`);
  await expect(errorElement).toBeVisible();
  
  if (errorMessage) {
    await expect(errorElement).toContainText(errorMessage);
  }
}

/**
 * 成功メッセージを確認するヘルパー関数
 */
export async function expectSuccessMessage(page: Page, message?: string) {
  const successElement = page.locator('.success-message, [data-testid="success-message"]');
  await expect(successElement).toBeVisible();
  
  if (message) {
    await expect(successElement).toContainText(message);
  }
}

/**
 * ローディング状態を確認するヘルパー関数
 */
export async function expectLoadingState(page: Page, isLoading = true) {
  const loadingElement = page.locator('[data-testid="loading"], .loading, button:has-text("検索中...")');
  
  if (isLoading) {
    await expect(loadingElement).toBeVisible();
  } else {
    await expect(loadingElement).not.toBeVisible();
  }
}

/**
 * アクセシビリティのキーボードナビゲーションをテストするヘルパー関数
 */
export async function testKeyboardNavigation(page: Page, expectedFocusSequence: string[]) {
  for (let i = 0; i < expectedFocusSequence.length; i++) {
    await page.keyboard.press('Tab');
    const selector = expectedFocusSequence[i];
    await expect(page.locator(selector)).toBeFocused();
  }
}

/**
 * カードコンポーネントの基本表示をテストするヘルパー関数
 */
export async function expectCardToBeVisible(page: Page, cardTestId: string, expectedElements?: string[]) {
  const card = page.locator(`[data-testid="${cardTestId}"]`);
  await expect(card).toBeVisible();
  
  if (expectedElements) {
    for (const element of expectedElements) {
      await expect(card.locator(element)).toBeVisible();
    }
  }
}

/**
 * フォームを送信するヘルパー関数
 */
export async function submitForm(page: Page, formData: Record<string, string>, submitButtonText = '送信') {
  for (const [fieldName, value] of Object.entries(formData)) {
    const input = page.locator(`input[name="${fieldName}"], textarea[name="${fieldName}"], select[name="${fieldName}"]`);
    
    if (await input.count() > 0) {
      const tagName = await input.evaluate(el => el.tagName.toLowerCase());
      
      if (tagName === 'select') {
        await input.selectOption(value);
      } else {
        await input.fill(value);
      }
    }
  }
  
  await page.click(`button:has-text("${submitButtonText}")`);
}

/**
 * ページネーションをテストするヘルパー関数
 */
export async function testPagination(page: Page) {
  const pagination = page.locator('[data-testid="pagination"]');
  
  if (await pagination.isVisible()) {
    const nextButton = page.locator('button:has-text("次へ")');
    
    if (await nextButton.isVisible() && await nextButton.isEnabled()) {
      const currentUrl = page.url();
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      // URLが変わったことを確認
      expect(page.url()).not.toBe(currentUrl);
      
      // 前のページボタンが表示されることを確認
      const prevButton = page.locator('button:has-text("前へ")');
      await expect(prevButton).toBeVisible();
    }
  }
}

/**
 * データの永続化をテストするヘルパー関数
 */
export async function testDataPersistence(page: Page, testAction: () => Promise<void>, verifyAction: () => Promise<void>) {
  // テストアクションを実行
  await testAction();
  
  // ページをリロード
  await page.reload();
  
  // データが永続化されていることを確認
  await verifyAction();
}