import RakutenLogo from '@/components/common/Icon/Rakuten';
import { Button } from '@/components/common/ui/button';
import { LabelHTMLAttributes } from 'react';

export default function RakutenButton({
  url,
  className = '',
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { url: string }) {
  const openLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <Button
      className={className}
      style={{ backgroundColor: '#be0100' }}
      onClick={openLink}
      variant="outline"
      size="icon"
    >
      <RakutenLogo />
    </Button>
  );
}
