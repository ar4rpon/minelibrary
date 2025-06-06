import AmazonLogo from '@/components/common/Icon/Amazon';
import { Button } from '@/components/ui/button';
import { LabelHTMLAttributes } from 'react';

export function AmazonButton({
  url,
  className = '',
}: LabelHTMLAttributes<HTMLLabelElement> & { url: string }) {
  const openLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <Button
      className={className}
      style={{ backgroundColor: '#febd69' }}
      onClick={openLink}
      variant="outline"
      size="icon"
    >
      <AmazonLogo />
    </Button>
  );
}

export default AmazonButton;
