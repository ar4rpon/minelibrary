/**
 * アプリケーション固有のエラークラス
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    
    // スタックトレースの調整
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * エラーがHTTPエラーかどうかを判定
   */
  isHttpError(): boolean {
    return this.statusCode !== undefined;
  }

  /**
   * エラーが認証エラーかどうかを判定
   */
  isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403;
  }

  /**
   * エラーがバリデーションエラーかどうかを判定
   */
  isValidationError(): boolean {
    return this.statusCode === 422;
  }

  /**
   * エラーがサーバーエラーかどうかを判定
   */
  isServerError(): boolean {
    return this.statusCode !== undefined && this.statusCode >= 500;
  }
}

/**
 * 型安全なエラーチェック関数
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}