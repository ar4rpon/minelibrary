import { Footer } from '@/components/common/layout/Footer';
import { Navigation } from '@/components/common/layout/Navigation';
import { PropsWithChildren, ReactNode } from 'react';

/**
 * デフォルトレイアウトコンポーネント
 * アプリケーションの基本的なレイアウト構造を提供する
 */
export function DefaultLayout({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  return (
    <>
      <Navigation />
      {/* ページの見出し */}
      {header && (
        <div className="mx-auto max-w-7xl px-4 py-6 font-bold sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold leading-tight text-gray-800">
            {header}
          </h1>
        </div>
      )}

      {/* コンテンツ */}
      <div className="min-h-screen bg-green-100">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
