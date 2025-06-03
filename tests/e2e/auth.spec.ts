import { test, expect } from '@playwright/test';

test.describe('認証フロー', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('新規ユーザー登録からログインまでのフロー', async ({ page }) => {
    // 新規登録ページへ移動
    await page.click('text=Register');
    await expect(page).toHaveURL('/register');

    // 新規ユーザー情報を入力
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="password_confirmation"]', 'password123');

    // 登録ボタンをクリック
    await page.click('button[type="submit"]');

    // ダッシュボードにリダイレクトされることを確認
    await expect(page).toHaveURL('/dashboard');

    // ユーザー名が表示されることを確認
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('ログインフロー', async ({ page }) => {
    // ログインページへ移動
    await page.click('text=Login');
    await expect(page).toHaveURL('/login');

    // ログインフォームが表示されることを確認
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("ログイン")')).toBeVisible();

    // テストユーザーでログイン（事前にシーダーで作成されたユーザー）
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');

    // ログインボタンをクリック
    await page.click('button:has-text("ログイン")');

    // ダッシュボードにリダイレクトされることを確認
    await expect(page).toHaveURL('/dashboard');
  });

  test('無効な認証情報でのログイン失敗', async ({ page }) => {
    await page.goto('/login');

    // 無効な認証情報を入力
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    // ログインボタンをクリック
    await page.click('button:has-text("ログイン")');

    // エラーメッセージが表示されることを確認
    await expect(page.locator('text=These credentials do not match our records.')).toBeVisible();
  });

  test('ログアウト機能', async ({ page }) => {
    // 事前にログイン
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button:has-text("ログイン")');

    // ダッシュボードに移動したことを確認
    await expect(page).toHaveURL('/dashboard');

    // ログアウトメニューを開く
    await page.click('[data-testid="user-menu"]');
    await page.click('text=ログアウト');

    // ホームページにリダイレクトされることを確認
    await expect(page).toHaveURL('/');
  });

  test('認証が必要なページへの未認証アクセス', async ({ page }) => {
    // 認証が必要なページに直接アクセス
    await page.goto('/book/search');

    // ログインページにリダイレクトされることを確認
    await expect(page).toHaveURL('/login');
  });
});