import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RankingBadgeProps {
  label: string;
  value: string;
  type: 'area' | 'population';
}

export function RankingBadge({ label, value, type }: RankingBadgeProps) {
  const getVariant = () => {
    if (type === 'area') {
      switch (value) {
        case 'Urban':
          return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
        case 'Suburban':
          return 'bg-green-100 text-green-800 hover:bg-green-200';
        case 'Rural':
          return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
        default:
          return 'bg-red-100 text-red-800 hover:bg-red-200';
      }
    } else {
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <Badge variant="secondary" className={cn('text-sm', getVariant())}>
        {value}
      </Badge>
    </div>
  );
}