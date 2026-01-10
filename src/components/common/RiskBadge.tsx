import { cn } from '@/lib/utils';

type RiskLevel = 'Low' | 'Medium' | 'High';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export function RiskBadge({ level, size = 'md', showDot = true }: RiskBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const levelClasses = {
    Low: 'risk-badge-low',
    Medium: 'risk-badge-medium',
    High: 'risk-badge-high',
  };

  const dotClasses = {
    Low: 'bg-risk-low',
    Medium: 'bg-risk-medium',
    High: 'bg-risk-high',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        sizeClasses[size],
        levelClasses[level]
      )}
    >
      {showDot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[level])} />
      )}
      {level} Risk
    </span>
  );
}
