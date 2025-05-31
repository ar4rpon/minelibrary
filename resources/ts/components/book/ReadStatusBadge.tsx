import { cn } from '@/lib/utils';
import { ReadStatus } from '@/types/';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

interface ReadStatusBadgeProps {
  status: ReadStatus;
}

export function ReadStatusBadge({ status }: ReadStatusBadgeProps) {
  const statusConfig = {
    want_read: {
      icon: Clock,
      text: '読みたい',
      className: 'bg-gray-100 text-gray-700',
    },
    reading: {
      icon: BookOpen,
      text: '読んでる',
      className: 'bg-blue-100 text-blue-700',
    },
    finished: {
      icon: CheckCircle,
      text: '読んだ',
      className: 'bg-green-100 text-green-700',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'absolute right-0 top-0 flex items-center gap-1 rounded-full px-3 py-1',
        'text-sm font-medium',
        config.className,
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{config.text}</span>
    </div>
  );
}
