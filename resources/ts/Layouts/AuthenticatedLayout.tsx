import Footer from '@/Components/Footer';
import Navigation from '@/Components/Navigation';
import { PropsWithChildren, ReactNode } from 'react';

export default function Authenticated({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-200">
        {/* ページの見出し */}
        {header && (
          <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {header}
            </div>
          </header>
        )}

        {/* コンテンツ */}
        <main className="px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
      <Footer />
    </>
  );
}
