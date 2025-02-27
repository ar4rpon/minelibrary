import { UserInfo as UserInfoType } from '@/types/bookShelf';

// デフォルト値
const DEFAULT_USER_NAME = 'ユーザー名';
const DEFAULT_USER_IMAGE = 'https://placehold.jp/150x150.png';

export function UserInfo({
  userName = DEFAULT_USER_NAME,
  userImage = DEFAULT_USER_IMAGE,
}: Partial<UserInfoType>) {
  return (
    <div className="flex items-center">
      <img
        className="w-9 h-9 rounded-3xl"
        src={userImage}
        alt={`${userName}のプロフィール画像`}
      />
      <p className="ml-2 md:ml-4 text-md font-semibold text-gray-600">{userName}</p>
    </div>
  );
}
