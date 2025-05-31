/**
 * Authentication API Types
 * 認証関連API通信型定義
 */

import { ApiResponse } from './common';

/**
 * ログインリクエスト
 */
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * ユーザー登録リクエスト
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * パスワードリセットリクエスト
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * パスワード更新リクエスト
 */
export interface PasswordUpdateRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

/**
 * プロフィール更新リクエスト
 */
export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  avatar?: File;
  bio?: string;
  preferences?: Record<string, unknown>;
}

/**
 * 認証ユーザーデータ
 */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  avatar?: string;
  bio?: string;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * ログインレスポンス
 */
export interface LoginResponse
  extends ApiResponse<{
    user: AuthUser;
    token?: string;
    expires_at?: string;
  }> {
  message: string;
}

/**
 * ユーザー登録レスポンス
 */
export interface RegisterResponse
  extends ApiResponse<{
    user: AuthUser;
    token?: string;
  }> {
  message: string;
}

/**
 * ログアウトレスポンス
 */
export interface LogoutResponse extends ApiResponse<null> {
  message: string;
}

/**
 * パスワードリセットレスポンス
 */
export interface PasswordResetResponse extends ApiResponse<null> {
  message: string;
}

/**
 * メール確認レスポンス
 */
export interface EmailVerificationResponse extends ApiResponse<null> {
  message: string;
}

/**
 * プロフィール取得レスポンス
 */
export type ProfileResponse = ApiResponse<AuthUser>;

/**
 * 認証状態確認レスポンス
 */
export interface AuthCheckResponse
  extends ApiResponse<{
    authenticated: boolean;
    user?: AuthUser;
  }> {}

/**
 * セッション情報
 */
export interface SessionInfo {
  id: string;
  user_id: number;
  ip_address: string;
  user_agent: string;
  last_activity: string;
  is_current: boolean;
}

/**
 * セッション一覧レスポンス
 */
export type SessionListResponse = ApiResponse<SessionInfo[]>;
