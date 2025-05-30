import { useState, useCallback } from 'react';
import { AppError, isAppError } from '@/lib/errors';

/**
 * 非同期処理の状態を管理するインターフェース
 */
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * 非同期処理の状態管理フック
 * APIコールなどの非同期処理を統一的に管理
 */
export function useAsyncState<T>(initialData?: T) {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData || null,
    loading: false,
    error: null,
  });

  /**
   * 非同期関数を実行し、状態を管理
   */
  const execute = useCallback(async (asyncFn: () => Promise<T>): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFn();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = isAppError(error) 
        ? error.message 
        : '予期せぬエラーが発生しました';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      
      throw error;
    }
  }, []);

  /**
   * 状態をリセット
   */
  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  /**
   * データのみを更新（ローディング状態を変更せずに）
   */
  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  /**
   * エラーのみをクリア
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    clearError,
    // 便利なフラグ
    isLoading: state.loading,
    hasError: !!state.error,
    hasData: !!state.data,
  };
}

/**
 * 複数の非同期状態を管理するフック
 */
export function useMultipleAsyncStates<T extends Record<string, any>>() {
  const [states, setStates] = useState<Record<keyof T, AsyncState<T[keyof T]>>>({} as any);

  const executeFor = useCallback(async <K extends keyof T>(
    key: K,
    asyncFn: () => Promise<T[K]>
  ): Promise<T[K]> => {
    setStates(prev => ({
      ...prev,
      [key]: { data: null, loading: true, error: null }
    }));
    
    try {
      const result = await asyncFn();
      setStates(prev => ({
        ...prev,
        [key]: { data: result, loading: false, error: null }
      }));
      return result;
    } catch (error) {
      const errorMessage = isAppError(error) 
        ? error.message 
        : '予期せぬエラーが発生しました';
      
      setStates(prev => ({
        ...prev,
        [key]: { data: null, loading: false, error: errorMessage }
      }));
      
      throw error;
    }
  }, []);

  const resetFor = useCallback(<K extends keyof T>(key: K) => {
    setStates(prev => ({
      ...prev,
      [key]: { data: null, loading: false, error: null }
    }));
  }, []);

  return {
    states,
    executeFor,
    resetFor,
  };
}