import { Phone } from 'lucide-react';

export function EmergencyBanner() {
  return (
    <div className="bg-destructive text-destructive-foreground py-2 px-4 text-center text-sm">
      <span className="flex items-center justify-center gap-2">
        <Phone className="h-4 w-4" />
        <span>
          <strong>Emergencias:</strong> 123 (General) | 144 (Defensa Civil) | 132 (Cruz Roja)
        </span>
      </span>
    </div>
  );
}
