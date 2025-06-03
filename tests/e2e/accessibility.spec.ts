import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('アクセシビリティテスト', () => {
  test.beforeEach(async ({ page }) => {
    // 事前にログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("ログイン")');
  });

  test('ダッシュボードのアクセシビリティ', async ({ page }) => {
    await page.goto('/dashboard');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('#advertisements') // 広告などの外部コンテンツを除外
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('書籍検索ページのアクセシビリティ', async ({ page }) => {
    await page.goto('/book/search');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa']) // WCAG 2.0 AA準拠をチェック
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('本棚一覧ページのアクセシビリティ', async ({ page }) => {
    await page.goto('/bookshelf');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('メモ一覧ページのアクセシビリティ', async ({ page }) => {
    await page.goto('/memo');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('お気に入り一覧ページのアクセシビリティ', async ({ page }) => {
    await page.goto('/book/favorite');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('プロフィールページのアクセシビリティ', async ({ page }) => {
    await page.goto('/profile');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('ダイアログのアクセシビリティ', async ({ page }) => {
    await page.goto('/bookshelf');

    // 本棚作成ダイアログを開く
    await page.click('button:has-text("本棚を作成")');
    
    // ダイアログが表示されるまで待機
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]') // ダイアログ部分のみをテスト
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // フォーカス管理のテスト
    // ダイアログ内の最初のフォーカス可能な要素にフォーカスが当たることを確認
    const firstFocusableElement = page.locator('[role="dialog"] input, [role="dialog"] button, [role="dialog"] select, [role="dialog"] textarea').first();
    if (await firstFocusableElement.isVisible()) {
      await expect(firstFocusableElement).toBeFocused();
    }

    // Escapeキーでダイアログが閉じることを確認
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('キーボードナビゲーション', async ({ page }) => {
    await page.goto('/book/search');

    // Tabキーで要素間を移動できることを確認
    await page.keyboard.press('Tab');
    
    // フォーカスが検索方法セレクトボックスに移ることを確認
    const firstSelect = page.locator('select').first();
    if (await firstSelect.isVisible()) {
      await expect(firstSelect).toBeFocused();
    }

    // 続けてTabキーを押してフォーカスが移動することを確認
    await page.keyboard.press('Tab');
    
    // 2番目のフォーカス可能な要素を確認
    const secondFocusable = page.locator('select, input, button').nth(1);
    if (await secondFocusable.isVisible()) {
      await expect(secondFocusable).toBeFocused();
    }
  });

  test('カラーコントラスト', async ({ page }) => {
    await page.goto('/dashboard');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa']) // カラーコントラストのルールを含む
      .analyze();

    // カラーコントラスト違反がないことを確認
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });

  test('フォームのアクセシビリティ', async ({ page }) => {
    await page.goto('/memo');

    // メモ作成フォームを開く
    await page.click('button:has-text("メモを作成")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // フォームラベルが適切に関連付けられていることを確認
    const formInputs = page.locator('[role="dialog"] input, [role="dialog"] textarea');
    const inputCount = await formInputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i);
      const inputId = await input.getAttribute('id');
      const inputName = await input.getAttribute('name');
      
      if (inputId) {
        // IDに対応するラベルが存在することを確認
        const label = page.locator(`label[for="${inputId}"]`);
        await expect(label).toBeVisible();
      } else if (inputName) {
        // name属性を使ったラベル検索
        const labelText = page.locator(`label:has-text("${inputName}")`);
        if (await labelText.count() > 0) {
          await expect(labelText.first()).toBeVisible();
        }
      }
    }
  });

  test('ARIA属性の適切な使用', async ({ page }) => {
    await page.goto('/book/search');

    // 検索を実行して結果を表示
    await page.fill('input[placeholder*="キーワード"]', 'JavaScript');
    await page.click('button:has-text("検索")');
    await page.waitForTimeout(2000);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // ARIA関連の違反がないことを確認
    const ariaViolations = accessibilityScanResults.violations.filter(
      violation => violation.id.includes('aria')
    );
    
    expect(ariaViolations).toEqual([]);

    // ローディング状態の適切なaria-label確認
    const searchButton = page.locator('button:has-text("検索")');
    if (await searchButton.isVisible()) {
      const ariaLabel = await searchButton.getAttribute('aria-label');
      const ariaDescribedBy = await searchButton.getAttribute('aria-describedby');
      
      // ARIA属性が適切に設定されているかチェック
      expect(ariaLabel || ariaDescribedBy).toBeTruthy();
    }
  });

  test('スクリーンリーダー対応', async ({ page }) => {
    await page.goto('/bookshelf');

    // ページタイトルが適切に設定されていることを確認
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).not.toBe('');

    // メインコンテンツエリアが適切にマークアップされていることを確認
    const main = page.locator('main, [role="main"]');
    await expect(main).toBeVisible();

    // ナビゲーションが適切にマークアップされていることを確認
    const nav = page.locator('nav, [role="navigation"]');
    await expect(nav).toBeVisible();

    // 見出しの階層が適切であることを確認
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    if (headingCount > 0) {
      // h1が存在することを確認
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
    }
  });
});