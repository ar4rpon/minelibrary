import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/defaultConponent/Dropdown';
import { Button } from '@/Components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { Link, usePage } from '@inertiajs/react';
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

import { useState } from 'react';

export default function Navigation() {
  const user = usePage().props.auth.user;

  const [open, setOpen] = useState(false);
  return (
    <nav className="border-b">
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

                        <ChevronDown size={18} className="ml-1" />
                      </button>
                    </span>
                  </Dropdown.Trigger>

                  <Dropdown.Content>
                    <Dropdown.Link href={route('profile.edit')}>
                      <div className="flex items-center">
                        <UserRoundPen size={16} color="green" />
                        <p className="pl-2">プロフィール</p>
                      </div>
                    </Dropdown.Link>
                    <Dropdown.Link href={route('searchbook')}>
                      <div className="flex items-center">
                        <Search size={16} color="green" />
                        <p className="pl-2">本を検索する</p>
                      </div>
                    </Dropdown.Link>
                    <Dropdown.Link href={route('bookshelflist')}>
                      <div className="flex items-center">
                        <Library size={16} color="green" />
                        <p className="pl-2">本棚一覧</p>
                      </div>
                    </Dropdown.Link>
                    <Dropdown.Link href={route('favoritebooklist')}>
                      <div className="flex items-center">
                        <BookHeart size={16} color="green" />
                        <p className="pl-2">お気に入り本一覧</p>
                      </div>
                    </Dropdown.Link>
                    <Dropdown.Link href={route('memolist')}>
                      <div className="flex items-center">
                        <NotepadText size={16} color="green" />
                        <p className="pl-2">読書メモ一覧</p>
                      </div>
                    </Dropdown.Link>
                    <Dropdown.Link
                      href={route('logout')}
                      method="post"
                      as="button"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} color="green" />
                        <p className="pl-2">ログアウト</p>
                      </div>
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              ) : (
                <>
                  <Link className="mr-4 text-sm" href={route('login')}>
                    ログイン
                  </Link>
                  <Link className="text-sm" href={route('register')}>
                    登録
                  </Link>
                </>
              )}
            </div>
          </div>
          {/* スマホメニュー */}
          {user ? (
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
                  <div className="mt-10 space-y-4">
                    <Link
                      className="flex border-b border-green-800 pb-2"
                      href={route('profile.edit')}
                    >
                      <UserRoundPen size={24} color="green" />
                      <p className="pl-2">プロフィール</p>
                    </Link>
                    <Link
                      className="flex border-b border-green-800 pb-2"
                      href={route('searchbook')}
                    >
                      <Search size={24} color="green" />
                      <p className="pl-2">本を検索する</p>
                    </Link>
                    <Link
                      className="flex border-b border-green-800 pb-2"
                      href={route('bookshelflist')}
                    >
                      <Library size={24} color="green" />
                      <p className="pl-2">本棚一覧</p>
                    </Link>
                    <Link
                      className="flex border-b border-green-800 pb-2"
                      href={route('favoritebooklist')}
                    >
                      <BookHeart size={24} color="green" />
                      <p className="pl-2">お気に入り本一覧</p>
                    </Link>
                    <Link
                      className="flex border-b border-green-800 pb-2"
                      href={route('memolist')}
                    >
                      <NotepadText size={24} color="green" />
                      <p className="pl-2">読書メモ一覧</p>
                    </Link>

                    <Link
                      className="flex border-b border-green-800 pb-2"
                      href={route('logout')}
                    >
                      <LogOut size={24} color="green" />
                      <p className="pl-2">ログアウト</p>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex items-center sm:hidden">
              <Link className="flex items-center pr-2" href={route('login')}>
                <p className="pl-1 text-xs">ログイン</p>
              </Link>
              <Link className="flex items-center" href={route('register')}>
                <p className="pl-1 text-xs">登録</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
