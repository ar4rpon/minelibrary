import { LabelHTMLAttributes } from 'react';
import { Button } from './ui/button';
import AmazonLogo from './Icon/Amazon';

export default function AmazonButton({
  url,
  className = '',
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { url: string }) {
  const openLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <Button className={className} style={{ backgroundColor: "#febd69" }} onClick={openLink} variant="outline" size="icon">
      <AmazonLogo />
    </Button>
  );

}
