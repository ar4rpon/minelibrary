import ApplicationLogo from '@/components/common/Icon/ApplicationLogo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, usePage } from '@inertiajs/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import {
  BookHeart,
  ChevronDown,
  Library,
  LogOut,
  Menu,
  NotepadText,
  Search,
  UserRoundPen,
} from 'lucide-react';
import { lazy, memo, Suspense, useCallback, useState } from 'react';

/**
 * ナビゲーションコンポーネント
 * アプリケーションのヘッダーナビゲーションを表示する
 */
const DropdownMenu = lazy(() =>
  import('@/components/ui/dropdown-menu').then((module) => ({
    default: module.DropdownMenu,
  })),
);

const MemoizedMenuItem = memo(
  ({
    icon: Icon,
    route,
    text,
  }: {
    icon: React.ElementType;
    route: string;
    text: string;
  }) => (
    <DropdownMenuItem className="focus:bg-gray-100 focus:outline-none">
      <Link href={route} className="w-full">
        <div className="flex items-center px-2 py-1.5">
          <Icon size={16} className="min-w-[16px] text-green-600" />
          <span className="pl-2 text-sm">{text}</span>
        </div>
      </Link>
    </DropdownMenuItem>
  ),
);
MemoizedMenuItem.displayName = 'MemoizedMenuItem';

export function Navigation() {
  const user = usePage().props.auth.user;
  const [open, setOpen] = useState(false);
  const userName = user?.name;

  const MobileMenuLink = useCallback(
    ({
      icon: Icon,
      route,
      text,
    }: {
      icon: React.ElementType;
      route: string;
      text: string;
    }) => (
      <Link
        href={route}
        className="flex items-center border-b border-green-800 pb-2"
        onClick={() => setOpen(false)}
      >
        <Icon size={24} className="min-w-[24px] text-green-600" />
        <span className="pl-2">{text}</span>
      </Link>
    ),
    [],
  );

  const PCDropdownMenu = useCallback(
    () => (
      <Suspense
        fallback={
          <Button variant="ghost" className="px-3 py-2 text-gray-500">
            Loading...
          </Button>
        }
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="px-3 py-2 text-gray-500 hover:text-gray-700 data-[state=open]:bg-gray-50"
              aria-label="ユーザーメニュー"
            >
              {userName}
              <ChevronDown
                size={18}
                className="ml-1 transition-transform data-[state=open]:rotate-180"
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-[200px] animate-in fade-in-80 slide-in-from-top-2"
            align="end"
            sideOffset={8}
          >
            <MemoizedMenuItem
              icon={UserRoundPen}
              route={route('profile.edit')}
              text="プロフィール"
            />
            <MemoizedMenuItem
              icon={Search}
              route={route('book.search')}
              text="本を検索する"
            />
            <MemoizedMenuItem
              icon={Library}
              route={route('book-shelf.list')}
              text="本棚一覧"
            />
            <MemoizedMenuItem
              icon={BookHeart}
              route={route('favorite.index')}
              text="お気に入り本一覧"
            />
            <MemoizedMenuItem
              icon={NotepadText}
              route={route('memos.index')}
              text="読書メモ一覧"
            />
            <DropdownMenuItem className="focus:bg-gray-100">
              <Link
                href={route('logout')}
                method="post"
                as="button"
                className="flex w-full items-center px-2 py-1.5 text-sm"
              >
                <LogOut size={16} className="min-w-[16px] text-green-600" />
                <span className="pl-2">ログアウト</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Suspense>
    ),
    [userName],
  );

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <ApplicationLogo />
            </Link>
          </div>

          {/* PCメニュー */}
          <div className="hidden sm:flex sm:items-center">
            <div className="relative">
              {user ? (
                <PCDropdownMenu />
              ) : (
                <div className="flex gap-4">
                  <Link
                    href={route('login')}
                    className="rounded px-3 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    ログイン
                  </Link>
                  <Link
                    href={route('register')}
                    className="rounded px-3 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    登録
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* モバイルメニュー */}
          {user ? (
            <div className="flex items-center sm:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="メニューを開く"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-[300px] overflow-y-auto"
                >
                  <DialogTitle className="sr-only">メニュー</DialogTitle>
                  <div className="mt-10 space-y-4">
                    <MobileMenuLink
                      icon={UserRoundPen}
                      route={route('profile.edit')}
                      text="プロフィール"
                    />
                    <MobileMenuLink
                      icon={Search}
                      route={route('book.search')}
                      text="本を検索する"
                    />
                    <MobileMenuLink
                      icon={Library}
                      route={route('book-shelf.list')}
                      text="本棚一覧"
                    />
                    <MobileMenuLink
                      icon={BookHeart}
                      route={route('favorite.index')}
                      text="お気に入り本一覧"
                    />
                    <MobileMenuLink
                      icon={NotepadText}
                      route={route('memos.index')}
                      text="読書メモ一覧"
                    />
                    <Link
                      href={route('logout')}
                      method="post"
                      as="button"
                      className="flex w-full items-center border-b border-green-800 pb-2"
                    >
                      <LogOut
                        size={24}
                        className="min-w-[24px] text-green-600"
                      />
                      <span className="pl-2">ログアウト</span>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex items-center space-x-4 sm:hidden">
              <Link
                href={route('login')}
                className="rounded px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
              >
                ログイン
              </Link>
              <Link
                href={route('register')}
                className="rounded px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
              >
                登録
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
