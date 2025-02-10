import { LabelHTMLAttributes } from 'react';
import { Button } from '@/Components/ui/button';
import RakutenLogo from '@/Components/Icon/Rakuten';

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
    <Button className={className} style={{ backgroundColor: "#be0100" }} onClick={openLink} variant="outline" size="icon">
      <RakutenLogo />
    </Button>
  );

}
