import ApplicationLogo from '@/components/Icon/ApplicationLogo';
import { Link } from '@inertiajs/react';

/**
 * フッターコンポーネント
 * アプリケーションのフッター部分を表示する
 */
export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4">
      <div className="flex flex-col pt-4 text-sm">
        <ApplicationLogo />
        <div className="pt-4">
          <Link
            href="/privacy"
            className="mr-4 text-muted-foreground hover:text-foreground"
          >
            プライバシーポリシー
          </Link>
        </div>
        <p className="pb-2 pt-4 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Mine Library All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
