import { UserInfo as UserInfoType } from '@/types/bookShelf';

// デフォルト値
const DEFAULT_USER_NAME = 'ユーザー名';
const DEFAULT_USER_IMAGE = 'https://placehold.jp/150x150.png';

/**
 * ユーザー情報を表示するコンポーネント
 */
export function UserInfo({
  userName = DEFAULT_USER_NAME,
  userImage = DEFAULT_USER_IMAGE,
}: Partial<UserInfoType>) {
  return (
    <div className="flex items-center">
      <img
        className="h-9 w-9 rounded-3xl"
        src={userImage}
        alt={`${userName}のプロフィール画像`}
      />
      <p className="text-md ml-2 font-semibold text-gray-600 md:ml-4">
        {userName}
      </p>
    </div>
  );
}
