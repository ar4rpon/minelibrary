import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Button } from '@/Components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const user = usePage().props.auth.user;

  const [open, setOpen] = useState(false);
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <ApplicationLogo />
              </Link>
            </div>
          </div>

          {/* PCメニュー */}
          <div className="hidden sm:ms-6 sm:flex sm:items-center">
            <div className="relative ms-3">
              {user ? (
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                      >
                        {user.name}

                        <svg
                          className="-me-0.5 ms-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  </Dropdown.Trigger>

                  <Dropdown.Content>
                    <Dropdown.Link href={route('profile.edit')}>
                      プロフィール
                    </Dropdown.Link>
                    <Dropdown.Link
                      href={route('logout')}
                      method="post"
                      as="button"
                    >
                      ログアウト
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              ) : (
                <>
                  <Link className="mr-4" href={route('login')}>
                    ログイン
                  </Link>
                  <Link href={route('register')}>登録</Link>
                </>
              )}
            </div>
          </div>
          {/* スマホハンバーガーメニュー */}
          <div className="sm:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <div className="mt-3">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                {user ? (
                  <div className="mt-4 space-y-4">
                    <Link className="block" href={route('profile.edit')}>
                      プロフィール
                    </Link>
                    <Link className="block" href={route('logout')}>
                      ログアウト
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    <Link className="block" href={route('login')}>
                      ログイン
                    </Link>
                    <Link className="block" href={route('register')}>
                      登録
                    </Link>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
