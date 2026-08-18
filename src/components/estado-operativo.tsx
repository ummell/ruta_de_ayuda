import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface EstadoOperativo {
  sector: string;
  estado: 'operativo' | 'parcial' | 'critico' | 'suspendido';
  detalle: string;
  fuente_url: string;
  fuente_nombre: string;
  corte: string;
}

function Semafoto({ estado }: { estado: string }) {
  if (estado === 'operativo') {
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  }
  if (estado === 'parcial') {
    return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  }
  return <XCircle className="h-4 w-4 text-red-500" />;
}

const SECTORES_LABELS: Record<string, string> = {
  telecomunicaciones: 'Telecomunicaciones',
  vias: 'Vías nacionales',
  aeropuertos: 'Aeropuertos',
  energia: 'Energía',
  hospitales: 'Hospitales',
  agua: 'Acueductos',
  puertos: 'Puertos',
};

function SectorCard({ sector }: { sector: EstadoOperativo }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-card rounded-lg border">
      <Semafoto estado={sector.estado} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{SECTORES_LABELS[sector.sector] ?? sector.sector}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sector.detalle}</p>
        <a
          href={sector.fuente_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline mt-1 inline-block"
        >
          {sector.fuente_nombre}
        </a>
      </div>
    </div>
  );
}

async function getEstadoOperativo(): Promise<EstadoOperativo[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/estado-operativo`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sectores ?? [];
  } catch {
    return [];
  }
}

export async function EstadoOperativo() {
  const sectores = await getEstadoOperativo();

  if (sectores.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sectores.map((sector) => (
        <SectorCard key={sector.sector} sector={sector} />
      ))}
    </div>
  );
}
