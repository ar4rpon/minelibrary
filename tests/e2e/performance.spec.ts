import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('パフォーマンステスト', () => {
  test.beforeEach(async ({ page, context }) => {
    // 事前にログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("ログイン")');
  });

  test('ダッシュボードのパフォーマンス', async ({ page, context }) => {
    await page.goto('/dashboard');

    // Lighthouseを実行
    await playAudit({
      page,
      thresholds: {
        performance: 80,
        accessibility: 90,
        'best-practices': 80,
        seo: 80,
      },
      reports: {
        formats: {
          html: true,
        },
        name: 'dashboard-lighthouse-report',
        directory: 'tests/reports/lighthouse',
      },
    });

    // パフォーマンス関連の基本チェック
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      };
    });

    // パフォーマンス指標の確認
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000); // 2秒以内
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1500); // 1.5秒以内
  });

  test('書籍検索ページのパフォーマンス', async ({ page }) => {
    await page.goto('/book/search');

    await playAudit({
      page,
      thresholds: {
        performance: 75,
        accessibility: 90,
        'best-practices': 80,
        seo: 80,
      },
      reports: {
        formats: {
          html: true,
        },
        name: 'book-search-lighthouse-report',
        directory: 'tests/reports/lighthouse',
      },
    });

    // 検索フォームの反応性をテスト
    const startTime = Date.now();
    await page.fill('input[placeholder*="キーワード"]', 'JavaScript');
    const inputTime = Date.now() - startTime;

    expect(inputTime).toBeLessThan(100); // 100ms以内で入力反映
  });

  test('本棚一覧ページのパフォーマンス', async ({ page }) => {
    await page.goto('/bookshelf');

    await playAudit({
      page,
      thresholds: {
        performance: 75,
        accessibility: 90,
        'best-practices': 80,
        seo: 80,
      },
      reports: {
        formats: {
          html: true,
        },
        name: 'bookshelf-lighthouse-report',
        directory: 'tests/reports/lighthouse',
      },
    });

    // 本棚カードの表示パフォーマンス
    const bookShelfCards = page.locator('[data-testid="bookshelf-card"]');
    const cardCount = await bookShelfCards.count();

    if (cardCount > 0) {
      const startTime = Date.now();
      await expect(bookShelfCards.first()).toBeVisible();
      const renderTime = Date.now() - startTime;

      expect(renderTime).toBeLessThan(500); // 500ms以内で表示
    }
  });

  test('メモ一覧ページのパフォーマンス', async ({ page }) => {
    await page.goto('/memo');

    await playAudit({
      page,
      thresholds: {
        performance: 75,
        accessibility: 90,
        'best-practices': 80,
        seo: 80,
      },
      reports: {
        formats: {
          html: true,
        },
        name: 'memo-lighthouse-report',
        directory: 'tests/reports/lighthouse',
      },
    });
  });

  test('画像読み込みパフォーマンス', async ({ page }) => {
    await page.goto('/book/search');

    // 検索を実行して書籍画像を表示
    await page.fill('input[placeholder*="キーワード"]', 'プログラミング');
    await page.click('button:has-text("検索")');

    // 検索結果が表示されるまで待機
    await page.waitForTimeout(3000);

    // 画像要素を取得
    const images = page.locator('img[src*="thumbnail"]');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // 各画像の読み込み時間を計測
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const image = images.nth(i);
        const startTime = Date.now();
        
        await image.waitFor({ state: 'visible' });
        
        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(2000); // 2秒以内で画像読み込み
      }
    }
  });

  test('APIレスポンス時間', async ({ page }) => {
    // APIレスポンス時間を測定
    const apiResponses: Array<{ url: string; duration: number }> = [];

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        const request = response.request();
        const timing = response.timing();
        apiResponses.push({
          url: response.url(),
          duration: timing.responseEnd,
        });
      }
    });

    await page.goto('/book/search');
    await page.fill('input[placeholder*="キーワード"]', 'React');
    await page.click('button:has-text("検索")');

    // API応答を待機
    await page.waitForTimeout(3000);

    // API応答時間をチェック
    apiResponses.forEach(response => {
      expect(response.duration).toBeLessThan(3000); // 3秒以内
    });
  });

  test('メモリリークテスト', async ({ page }) => {
    await page.goto('/dashboard');

    // 初期メモリ使用量を取得
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // 複数のページ間を移動してメモリ使用量を監視
    const pages = ['/book/search', '/bookshelf', '/memo', '/book/favorite'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForTimeout(1000);
      
      // ガベージコレクションを強制実行
      if (process.env.NODE_ENV === 'test') {
        await page.evaluate(() => {
          if ((window as any).gc) {
            (window as any).gc();
          }
        });
      }
    }

    // ダッシュボードに戻る
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);

    // 最終メモリ使用量を取得
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // メモリ増加が許容範囲内であることを確認（初期の2倍以下）
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory / initialMemory;
      expect(memoryIncrease).toBeLessThan(2.0);
    }
  });

  test('大量データ処理パフォーマンス', async ({ page }) => {
    // 大量の書籍データを持つ本棚をテスト
    await page.goto('/bookshelf');

    const bookShelfCards = page.locator('[data-testid="bookshelf-card"]');
    const cardCount = await bookShelfCards.count();

    if (cardCount > 0) {
      // 最初の本棚詳細ページに移動
      const startTime = Date.now();
      await bookShelfCards.first().click();
      
      // 詳細ページが表示されるまでの時間を計測
      await expect(page.locator('h1')).toBeVisible();
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000); // 3秒以内で表示

      // スクロールパフォーマンスをテスト
      const scrollStartTime = Date.now();
      await page.mouse.wheel(0, 1000);
      await page.waitForTimeout(100);
      const scrollTime = Date.now() - scrollStartTime;

      expect(scrollTime).toBeLessThan(200); // 200ms以内でスクロール完了
    }
  });

  test('ネットワーク条件による影響', async ({ page, context }) => {
    // 低速ネットワーク条件をシミュレート
    await context.route('**/*', async route => {
      // 200msの遅延を追加
      await new Promise(resolve => setTimeout(resolve, 200));
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toBeVisible();
    const loadTime = Date.now() - startTime;

    // 低速ネットワークでも5秒以内で表示されることを確認
    expect(loadTime).toBeLessThan(5000);
  });
});