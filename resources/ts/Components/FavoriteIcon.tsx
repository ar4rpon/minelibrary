import { Heart } from 'lucide-react';
import { Button } from '@/Components/ui/button';

interface favoriteIconProps {
  isFavorite: boolean;
  onClick: () => void;
}

export default function FavoriteIcon({ isFavorite, onClick }: favoriteIconProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="shrink-0"
      onClick={onClick}
    >
      <Heart
        className={`h-5 w-5 ${isFavorite ? 'fill-current text-red-500' : 'text-muted-foreground'}`}
      />
    </Button>
  );
}
