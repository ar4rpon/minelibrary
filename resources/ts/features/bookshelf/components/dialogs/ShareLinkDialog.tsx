import { BaseDialog } from '@/components/common/dialog/BaseDialog';
import { Button } from '@/components/common/ui/button';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/common/ui/dialog';
import { Input } from '@/components/common/ui/input';
import { generateShareLink } from '@/Services/bookShelfService';
import { DialogProps } from '@/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Copy } from 'lucide-react';
import { useState } from 'react';

interface ShareLinkDialogProps extends DialogProps {
  bookShelfId: number;
}

export function ShareLinkDialog({
  isOpen,
  onClose,
  bookShelfId,
}: ShareLinkDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  const handleGenerateShareLink = async () => {
    setIsLoading(true);
    try {
      console.log('ダイアログから送信するbookShelfId:', bookShelfId);
      const response = await generateShareLink(bookShelfId);
      console.log(response);
      if (response) {
        console.log('共有リンク生成成功:', response);
        setShareUrl(response.share_url);
        setExpiryDate(response.expiry_date);
      } else {
        console.error('共有リンク生成失敗: レスポンスがnullです');
        alert('共有リンクの生成に失敗しました');
      }
    } catch (error) {
      console.error('共有リンク生成エラー:', error);
      alert(`共有リンクの生成中にエラーが発生しました: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(
      () => {
        alert('リンクをクリップボードにコピーしました');
      },
      (err) => {
        console.error('クリップボードへのコピーに失敗しました', err);
        alert('リンクのコピーに失敗しました');
      },
    );
  };

  const handleClose = () => {
    setShareUrl('');
    setExpiryDate(null);
    onClose();
  };

  const formattedExpiryDate = expiryDate
    ? format(new Date(expiryDate), 'yyyy年MM月dd日', { locale: ja })
    : '';

  return (
    <BaseDialog isOpen={isOpen} onClose={handleClose}>
      <DialogHeader>
        <DialogTitle>本棚を共有する</DialogTitle>
      </DialogHeader>
      <DialogDescription>
        未ログインユーザーでも閲覧できる共有リンクを生成します。
      </DialogDescription>

      <div className="flex w-full flex-col">
        {!shareUrl ? (
          <div className="py-4">
            <p className="mb-4 text-sm text-gray-600">
              共有リンクを生成すると、リンクを知っている人なら誰でもこの本棚を閲覧できるようになります。
              リンクの有効期限は7日間です。
            </p>
            <Button
              onClick={handleGenerateShareLink}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? '生成中...' : '共有リンクを生成する'}
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <p className="mb-2 text-sm text-gray-600">
              以下のリンクを共有してください。有効期限: {formattedExpiryDate}
            </p>
            <div className="flex items-center space-x-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
                title="クリップボードにコピー"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={handleClose}>
            閉じる
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
}
