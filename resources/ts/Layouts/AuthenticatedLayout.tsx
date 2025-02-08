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
      <div className="min-h-screen">
        {/* ページの見出し */}
        {header && (
          <div className="mx-auto max-w-7xl px-4 py-6 font-bold sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold leading-tight text-gray-800">
              {header}
            </h1>
          </div>
        )}

        {/* コンテンツ */}
        <main className="mx-auto min-h-dvh max-w-7xl bg-green-100 px-4 sm:px-6 lg:px-8 xl:max-w-full">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
