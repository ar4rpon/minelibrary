import { test, expect } from '@playwright/test';

test.describe('お気に入り本一覧ページテスト', () => {
  test.beforeEach(async ({ page }) => {
    // テストユーザーでログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("ログイン"), button[type="submit"]');
    await page.waitForURL(/\/(dashboard|book)/, { timeout: 10000 });
  });

  test('お気に入り本一覧ページが表示される', async ({ page }) => {
    // コンソールエラーをキャプチャ
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      }
    });

    // JavaScriptエラーをキャプチャ
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    // ネットワークエラーをキャプチャ
    const networkErrors: string[] = [];
    page.on('response', (response) => {
      if (!response.ok()) {
        networkErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    // お気に入り本一覧ページに移動
    await page.goto('/favorite-book/list');
    
    // ページの読み込みを待つ
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // 追加の待機時間

    // ページタイトルが設定されているかを確認
    const title = await page.title();
    console.log('Page title:', title);

    // ページコンテンツが表示されているかを確認
    const bodyText = await page.locator('body').textContent();
    console.log('Page body content (first 200 chars):', bodyText?.substring(0, 200));

    // 基本的なレイアウト要素が存在するかを確認
    const hasHeader = await page.locator('header, h1, [role="banner"]').count() > 0;
    const hasMain = await page.locator('main, [role="main"], .main-content').count() > 0;
    const hasContent = bodyText && bodyText.trim().length > 0;

    console.log('Has header:', hasHeader);
    console.log('Has main content:', hasMain);
    console.log('Has content:', hasContent);

    // エラー情報を出力
    if (consoleMessages.length > 0) {
      console.log('Console messages:', consoleMessages);
    }
    if (jsErrors.length > 0) {
      console.log('JavaScript errors:', jsErrors);
    }
    if (networkErrors.length > 0) {
      console.log('Network errors:', networkErrors);
    }

    // ページが真っ白でないことを確認
    expect(hasContent).toBe(true);
  });

  test('お気に入り本一覧ページのAPI呼び出しを確認', async ({ page }) => {
    // APIリクエストをキャプチャ
    const apiRequests: any[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
        });
      }
    });

    // APIレスポンスをキャプチャ
    const apiResponses: any[] = [];
    page.on('response', (response) => {
      if (response.url().includes('/api/')) {
        apiResponses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
        });
      }
    });

    // お気に入り本一覧ページに移動
    await page.goto('/favorite-book/list');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('API requests:', apiRequests);
    console.log('API responses:', apiResponses);

    // お気に入り関連のAPIが呼び出されているかを確認
    const favoriteApiCalls = apiRequests.filter(req => 
      req.url.includes('favorite') || req.url.includes('book')
    );

    console.log('Favorite-related API calls:', favoriteApiCalls);
  });

  test('お気に入り本一覧ページの構造確認', async ({ page }) => {
    // お気に入り本一覧ページに移動
    await page.goto('/favorite-book/list');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // HTML構造を確認
    const htmlContent = await page.content();
    console.log('Page HTML structure:');
    console.log('Has DOCTYPE:', htmlContent.includes('<!DOCTYPE'));
    console.log('Has HTML tag:', htmlContent.includes('<html'));
    console.log('Has HEAD tag:', htmlContent.includes('<head'));
    console.log('Has BODY tag:', htmlContent.includes('<body'));
    
    // React/Inertiaが正しく初期化されているかを確認
    const hasReactRoot = await page.locator('#app, [data-page]').count() > 0;
    console.log('Has React root element:', hasReactRoot);

    // CSSが読み込まれているかを確認
    const hasStyles = await page.locator('link[rel="stylesheet"], style').count() > 0;
    console.log('Has CSS styles:', hasStyles);

    // JavaScriptが読み込まれているかを確認
    const hasScripts = await page.locator('script[src]').count() > 0;
    console.log('Has JavaScript files:', hasScripts);
  });

  test('お気に入り本一覧ページのInertia.js確認', async ({ page }) => {
    // お気に入り本一覧ページに移動
    await page.goto('/favorite-book/list');
    await page.waitForLoadState('networkidle');

    // InertiaのページデータがJavaScriptで利用可能かを確認
    const inertiaPageData = await page.evaluate(() => {
      return {
        hasInertia: typeof window !== 'undefined' && 'Inertia' in window,
        hasInertiaPage: typeof window !== 'undefined' && window.hasOwnProperty('page'),
        windowKeys: typeof window !== 'undefined' ? Object.keys(window).filter(key => key.includes('nertia') || key.includes('age')) : [],
      };
    });

    console.log('Inertia page data:', inertiaPageData);

    // ページコンポーネントが存在するかを確認
    const hasPageComponent = await page.locator('[data-page], .page-component').count() > 0;
    console.log('Has page component:', hasPageComponent);
  });
});