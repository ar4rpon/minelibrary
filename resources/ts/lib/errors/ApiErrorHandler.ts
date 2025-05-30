import { AxiosError } from 'axios';
import { AppError } from './AppError';

/**
 * API エラーハンドラー
 * 統一されたエラー処理とログ出力を提供
 */
export class ApiErrorHandler {
  /**
   * エラーを統一的に処理する
   */
  static handle(error: unknown, context: string): never {
    if (error instanceof AxiosError) {
      const message = this.extractMessageFromAxiosError(error);
      const statusCode = error.response?.status;
      
      console.error(`${context}: ${message}`, {
        statusCode,
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        response: error.response?.data,
      });
      
      throw new AppError(message, statusCode, error);
    }
    
    if (error instanceof Error) {
      console.error(`${context}: ${error.message}`, error);
      throw new AppError(error.message, undefined, error);
    }
    
    console.error(`${context}: 予期せぬエラーが発生しました`, error);
    throw new AppError('予期せぬエラーが発生しました', undefined, error);
  }

  /**
   * 非同期関数をエラーハンドリング付きで実行
   */
  static async executeWithErrorHandling<T>(
    asyncFn: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      return await asyncFn();
    } catch (error) {
      this.handle(error, context);
    }
  }

  /**
   * AxiosErrorからユーザーフレンドリーなメッセージを抽出
   */
  private static extractMessageFromAxiosError(error: AxiosError): string {
    // レスポンスボディからメッセージを抽出
    const responseData = error.response?.data as any;
    
    if (responseData?.message) {
      return responseData.message;
    }
    
    // バリデーションエラーの場合
    if (error.response?.status === 422 && responseData?.errors) {
      const firstError = Object.values(responseData.errors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0] as string;
      }
    }
    
    // HTTPステータスコードに基づく標準メッセージ
    switch (error.response?.status) {
      case 400:
        return 'リクエストが正しくありません';
      case 401:
        return '認証が必要です';
      case 403:
        return 'アクセス権限がありません';
      case 404:
        return 'リソースが見つかりません';
      case 422:
        return '入力データに問題があります';
      case 429:
        return 'リクエストが多すぎます。しばらく待ってからお試しください';
      case 500:
        return 'サーバーエラーが発生しました';
      case 502:
        return 'サーバーに接続できません';
      case 503:
        return 'サービスが一時的に利用できません';
      default:
        return error.message || '通信エラーが発生しました';
    }
  }

  /**
   * エラーをユーザーに表示用の形式に変換
   */
  static formatForUser(error: AppError): {
    title: string;
    message: string;
    type: 'error' | 'warning' | 'info';
  } {
    if (error.isAuthError()) {
      return {
        title: '認証エラー',
        message: error.message,
        type: 'warning',
      };
    }

    if (error.isValidationError()) {
      return {
        title: '入力エラー',
        message: error.message,
        type: 'warning',
      };
    }

    if (error.isServerError()) {
      return {
        title: 'システムエラー',
        message: 'システムに問題が発生しました。管理者にお問い合わせください。',
        type: 'error',
      };
    }

    return {
      title: 'エラー',
      message: error.message,
      type: 'error',
    };
  }
}