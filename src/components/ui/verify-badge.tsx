import { cn } from '@/lib/utils';
import { Shield, CheckCircle, Home } from 'lucide-react';

type BadgeType = 'verde' | 'amarillo' | 'azul';

interface VerifyBadgeProps {
  type: BadgeType;
  showLabel?: boolean;
  className?: string;
}

const badgeConfig = {
  verde: {
    label: 'Verificado Alto',
    description: 'Verificado por autoridad oficial',
    icon: Shield,
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  amarillo: {
    label: 'Avalado',
    description: 'Confirmado por voluntario local',
    icon: CheckCircle,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  azul: {
    label: 'Voluntario Hogar',
    description: 'No es un albergue oficial. Persona ofreciendo su hogar para ayudar',
    icon: Home,
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
};

export function VerifyBadge({ type, showLabel = true, className }: VerifyBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium',
        config.className,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

export function VerifyBadgeWithDescription({ type, className }: VerifyBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn('rounded-lg border p-4', config.className, className)}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-5 w-5" />
        <span className="font-semibold">{config.label}</span>
      </div>
      <p className="text-sm opacity-90">{config.description}</p>
    </div>
  );
}
