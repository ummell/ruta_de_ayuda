'use client';

import { ChevronLeft, ChevronRight, ExternalLink, AlertCircle, Megaphone, Wrench, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface Publicacion {
  id: string;
  titulo: string;
  descripcion: string;
  imagen_url?: string | null;
  fuente_nombre: string;
  fuente_url: string;
  categoria: 'alerta' | 'comunicado' | 'convocatoria' | 'operativo';
  ciudades: string[];
  prioridad: number;
  created_at: string;
}

const CATEGORIA_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  alerta: {
    label: 'Alerta',
    icon: <AlertCircle className="h-3 w-3" />,
    color: 'bg-red-100 text-red-800 border-red-300',
  },
  comunicado: {
    label: 'Comunicado',
    icon: <Megaphone className="h-3 w-3" />,
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  convocatoria: {
    label: 'Convocatoria',
    icon: <Users className="h-3 w-3" />,
    color: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  operativo: {
    label: 'Operativo',
    icon: <Wrench className="h-3 w-3" />,
    color: 'bg-amber-100 text-amber-800 border-amber-300',
  },
};

function formatFechaCorta(iso: string) {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

interface PublicacionesCarouselProps {
  publicaciones: Publicacion[];
  autoplayMs?: number;
}

export function PublicacionesCarousel({ publicaciones, autoplayMs = 8000 }: PublicacionesCarouselProps) {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    function update() {
      if (typeof window === 'undefined') return;
      const w = window.innerWidth;
      if (w >= 1024) setPerView(3);
      else if (w >= 640) setPerView(2);
      else setPerView(1);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (publicaciones.length <= perView) return;
    const t = setInterval(() => {
      setIndex((i) => (i + perView) % Math.max(1, publicaciones.length));
    }, autoplayMs);
    return () => clearInterval(t);
  }, [publicaciones.length, perView, autoplayMs]);

  if (publicaciones.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No hay publicaciones recientes.
      </div>
    );
  }

  const maxIndex = Math.max(0, publicaciones.length - perView);
  const safeIndex = Math.min(index, maxIndex);
  const visibles = publicaciones.slice(safeIndex, safeIndex + perView);

  function prev() {
    setIndex((i) => (i - perView + publicaciones.length) % publicaciones.length);
  }
  function next() {
    setIndex((i) => (i + perView) % publicaciones.length);
  }

  const dotCount = Math.ceil(publicaciones.length / perView);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((pub) => {
          const meta = CATEGORIA_META[pub.categoria] ?? CATEGORIA_META.comunicado;
          return (
            <a
              key={pub.id}
              href={pub.fuente_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card rounded-lg border hover:border-primary/50 hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div className="p-4 space-y-2 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${meta.color}`}
                  >
                    {meta.icon}
                    {meta.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatFechaCorta(pub.created_at)}</span>
                </div>
                <h3 className="font-semibold text-sm leading-tight">{pub.titulo}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                  {pub.descripcion}
                </p>
                {pub.ciudades.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {pub.ciudades.slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
                      >
                        {c}
                      </span>
                    ))}
                    {pub.ciudades.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{pub.ciudades.length - 3}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">{pub.fuente_nombre}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {publicaciones.length > perView && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={prev}
            className="p-1.5 rounded-full border hover:bg-muted transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5">
            {Array.from({ length: dotCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i * perView)}
                className={`h-1.5 rounded-full transition-all ${
                  Math.floor(safeIndex / perView) === i ? 'w-6 bg-primary' : 'w-1.5 bg-muted'
                }`}
                aria-label={`Ir al grupo ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="p-1.5 rounded-full border hover:bg-muted transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}