import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/Icon/ApplicationLogo';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-4 ">
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
