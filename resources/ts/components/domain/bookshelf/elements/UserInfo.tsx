import { UserInfo as UserInfoType } from '@/types/domain/user';

// デフォルト値
const DEFAULT_USER_NAME = 'ユーザー名';

/**
 * ユーザー情報を表示するコンポーネント
 */
export function UserInfo({
  userName = DEFAULT_USER_NAME,
}: Partial<UserInfoType>) {
  return (
    <div className="flex items-center">
      <p className="text-md font-semibold text-gray-600">作成者：{userName}</p>
    </div>
  );
}
