/**
 * Inertia.js Type Definitions
 * Inertia.js固有の型定義
 */

import { AuthUser } from './api/auth';

/**
 * Inertia Page Props
 * 全ページで共有されるプロパティ
 */
export interface PageProps {
  auth: {
    user: AuthUser;
  };
  flash: {
    message?: string;
    error?: string;
    success?: string;
    warning?: string;
  };
  errors: Record<string, string>;
  csrf_token: string;
}

/**
 * Inertia Router Methods
 */
declare module '@inertiajs/react' {
  interface Router {
    get(
      url: string,
      data?: Record<string, unknown>,
      options?: VisitOptions,
    ): void;
    post(
      url: string,
      data?: Record<string, unknown>,
      options?: VisitOptions,
    ): void;
    put(
      url: string,
      data?: Record<string, unknown>,
      options?: VisitOptions,
    ): void;
    patch(
      url: string,
      data?: Record<string, unknown>,
      options?: VisitOptions,
    ): void;
    delete(url: string, options?: VisitOptions): void;
    reload(options?: ReloadOptions): void;
    visit(url: string, options?: VisitOptions): void;
  }

  interface VisitOptions {
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    data?: Record<string, unknown>;
    replace?: boolean;
    preserveScroll?: boolean;
    preserveState?: boolean;
    only?: string[];
    except?: string[];
    headers?: Record<string, string>;
    errorBag?: string;
    forceFormData?: boolean;
    onBefore?: (visit: PendingVisit) => boolean | void;
    onStart?: (visit: PendingVisit) => void;
    onProgress?: (progress: Progress) => void;
    onSuccess?: (page: Page) => void;
    onError?: (errors: Record<string, string>) => void;
    onCancel?: () => void;
    onFinish?: (visit: ActiveVisit) => void;
  }

  interface ReloadOptions {
    only?: string[];
    except?: string[];
    onBefore?: (visit: PendingVisit) => boolean | void;
    onStart?: (visit: PendingVisit) => void;
    onProgress?: (progress: Progress) => void;
    onSuccess?: (page: Page) => void;
    onError?: (errors: Record<string, string>) => void;
    onCancel?: () => void;
    onFinish?: (visit: ActiveVisit) => void;
  }
}
