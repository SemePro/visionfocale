import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'from-primary-500 to-primary-600',
}: StatsCardProps) {
  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-neutral-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-neutral-900">{value}</h3>
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="text-white" size={24} />
          </div>
        </div>
        {change && (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                changeType === 'positive'
                  ? 'text-green-600'
                  : changeType === 'negative'
                  ? 'text-red-600'
                  : 'text-neutral-600'
              }`}
            >
              {change}
            </span>
            <span className="text-xs text-neutral-500">vs mois dernier</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


