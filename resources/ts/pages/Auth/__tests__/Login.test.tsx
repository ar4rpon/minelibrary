import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Login from '../Login';

// モック関数
const mockPost = vi.fn();
const mockSetData = vi.fn();
const mockReset = vi.fn();

vi.mock('@inertiajs/react', () => ({
  Head: ({ title }: { title: string }) => <title>{title}</title>,
  Link: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
  useForm: vi.fn(() => ({
    data: { email: '', password: '', remember: false },
    setData: mockSetData,
    post: mockPost,
    processing: false,
    errors: {},
    reset: mockReset,
  })),
}));

// routeグローバル関数をモック
global.route = vi.fn((name: string) => {
  const routes: Record<string, string> = {
    login: '/login',
    'password.request': '/forgot-password',
  };
  return routes[name] || '/';
});

// DefaultLayoutをモック
vi.mock('@/components/common/layout', () => ({
  DefaultLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="default-layout">{children}</div>
  ),
}));

// InputErrorをモック
vi.mock('@/components/common/InputError', () => ({
  default: ({
    message,
    className,
  }: {
    message?: string;
    className?: string;
  }) =>
    message ? (
      <div className={className} data-testid="input-error">
        {message}
      </div>
    ) : null,
}));

describe('Login', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ログインフォームが正しく表示される', () => {
    render(<Login canResetPassword={true} />);

    // ページタイトル
    expect(document.title).toBe('Log in');

    // DefaultLayoutが使用される
    expect(screen.getByTestId('default-layout')).toBeInTheDocument();

    // フォーム要素
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /remember me/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'ログイン' }),
    ).toBeInTheDocument();

    // パスワードリセットリンク
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
  });

  it('パスワードリセットが無効な場合、リンクが表示されない', () => {
    render(<Login canResetPassword={false} />);

    expect(screen.queryByText('Forgot your password?')).not.toBeInTheDocument();
  });

  it('ステータスメッセージが表示される', () => {
    const status = 'Password reset link sent.';
    render(<Login status={status} canResetPassword={true} />);

    expect(screen.getByText(status)).toBeInTheDocument();
    expect(screen.getByText(status)).toHaveClass('text-green-600');
  });

  it('フォーム入力値が正しく処理される', async () => {
    const { useForm } = await import('@inertiajs/react');
    vi.mocked(useForm).mockReturnValue({
      data: {
        email: 'test@example.com',
        password: 'password123',
        remember: true,
      },
      setData: mockSetData,
      post: mockPost,
      processing: false,
      errors: {},
      reset: mockReset,
    });

    render(<Login canResetPassword={true} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const rememberCheckbox = screen.getByRole('checkbox', {
      name: /remember me/i,
    });

    // 入力値の確認
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(rememberCheckbox).toBeChecked();
  });

  it('エラーメッセージが表示される', async () => {
    const { useForm } = await import('@inertiajs/react');
    vi.mocked(useForm).mockReturnValue({
      data: { email: '', password: '', remember: false },
      setData: mockSetData,
      post: mockPost,
      processing: false,
      errors: {
        email: 'The email field is required.',
        password: 'The password field is required.',
      },
      reset: mockReset,
    });

    render(<Login canResetPassword={true} />);

    expect(
      screen.getByText('The email field is required.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('The password field is required.'),
    ).toBeInTheDocument();
  });

  it('処理中の場合ボタンが無効化される', async () => {
    const { useForm } = await import('@inertiajs/react');
    vi.mocked(useForm).mockReturnValue({
      data: { email: '', password: '', remember: false },
      setData: mockSetData,
      post: mockPost,
      processing: true,
      errors: {},
      reset: mockReset,
    });

    render(<Login canResetPassword={true} />);

    const submitButton = screen.getByRole('button', { name: 'ログイン' });
    expect(submitButton).toBeDisabled();
  });

  it('フォーム送信時に正しいデータでpost関数が呼ばれる', async () => {
    const { useForm } = await import('@inertiajs/react');
    vi.mocked(useForm).mockReturnValue({
      data: {
        email: 'test@example.com',
        password: 'password123',
        remember: false,
      },
      setData: mockSetData,
      post: mockPost,
      processing: false,
      errors: {},
      reset: mockReset,
    });

    render(<Login canResetPassword={true} />);

    const form = screen
      .getByRole('button', { name: 'ログイン' })
      .closest('form');

    if (form) {
      fireEvent.submit(form);
    }

    expect(mockPost).toHaveBeenCalledWith('/login', {
      onFinish: expect.any(Function),
    });
  });

  it('入力値変更時にsetData関数が呼ばれる', async () => {
    const { useForm } = await import('@inertiajs/react');
    vi.mocked(useForm).mockReturnValue({
      data: { email: '', password: '', remember: false },
      setData: mockSetData,
      post: mockPost,
      processing: false,
      errors: {},
      reset: mockReset,
    });

    render(<Login canResetPassword={true} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    // メールアドレス入力
    await user.type(emailInput, 'test@example.com');

    // パスワード入力
    await user.type(passwordInput, 'password123');

    // setDataが適切に呼ばれることを確認（文字数分呼ばれる）
    expect(mockSetData).toHaveBeenCalled();
    expect(mockSetData).toHaveBeenCalledWith('email', expect.any(String));
    expect(mockSetData).toHaveBeenCalledWith('password', expect.any(String));
  });

  it('Remember meチェックボックスの変更が処理される', async () => {
    const { useForm } = await import('@inertiajs/react');
    vi.mocked(useForm).mockReturnValue({
      data: { email: '', password: '', remember: false },
      setData: mockSetData,
      post: mockPost,
      processing: false,
      errors: {},
      reset: mockReset,
    });

    render(<Login canResetPassword={true} />);

    const rememberCheckbox = screen.getByRole('checkbox', {
      name: /remember me/i,
    });
    await user.click(rememberCheckbox);

    expect(mockSetData).toHaveBeenCalledWith('remember', true);
  });

  it('フォーム送信時にonFinishでパスワードがリセットされる', async () => {
    let onFinishCallback: (() => void) | undefined;

    mockPost.mockImplementation((url: string, options: any) => {
      onFinishCallback = options.onFinish;
    });

    const { useForm } = await import('@inertiajs/react');
    vi.mocked(useForm).mockReturnValue({
      data: {
        email: 'test@example.com',
        password: 'password123',
        remember: false,
      },
      setData: mockSetData,
      post: mockPost,
      processing: false,
      errors: {},
      reset: mockReset,
    });

    render(<Login canResetPassword={true} />);

    const form = screen
      .getByRole('button', { name: 'ログイン' })
      .closest('form');

    if (form) {
      fireEvent.submit(form);
    }

    // onFinishコールバックが実行されるとreset('password')が呼ばれる
    if (onFinishCallback) {
      onFinishCallback();
    }

    expect(mockReset).toHaveBeenCalledWith('password');
  });

  it('パスワードリセットリンクが正しいURLを持つ', () => {
    render(<Login canResetPassword={true} />);

    const resetLink = screen.getByText('Forgot your password?');
    expect(resetLink).toHaveAttribute('href', '/forgot-password');
  });

  it('フォームの各入力フィールドが適切な属性を持つ', () => {
    render(<Login canResetPassword={true} />);

    const emailInput = screen.getByLabelText('Email');

    // Email input attributes
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(emailInput).toHaveAttribute('autoComplete', 'username');

    // Password input attributes (use ID selector as password field doesn't show in getByLabelText correctly)
    const passwordInputElement = document.getElementById('password');
    expect(passwordInputElement).toHaveAttribute('type', 'password');
    expect(passwordInputElement).toHaveAttribute('name', 'password');
    expect(passwordInputElement).toHaveAttribute(
      'autoComplete',
      'current-password',
    );
  });
});
