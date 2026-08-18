'use client';

import { useEffect, useState } from 'react';
import { X, Phone, MessageCircle, Share2, MapPin, Calendar, User, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Persona {
  id: string;
  nombre: string;
  apellido: string;
  edad?: number;
  genero: string;
  ultima_ubicacion: string;
  fecha_desaparicion: string;
  descripcion?: string;
  reportante_nombre: string;
  reportante_telefono: string;
  reportante_relacion: string;
  badge: string;
  estado: string;
  foto_url?: string | null;
  created_at: string;
}


interface PersonaDetailDrawerProps {
  persona: Persona | null;
  onClose: () => void;
}

export function PersonaDetailDrawer({ persona, onClose }: PersonaDetailDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (persona) {
      setMounted(true);
    }
  }, [persona]);

  if (!persona && !mounted) return null;

  const handleClose = () => {
    setMounted(false);
    setTimeout(onClose, 200); // esperar animación
  };

  const handleShare = () => {
    if (!persona) return;
    const text = `Ayuda a encontrar a ${persona.nombre} ${persona.apellido}\nÚltima ubicación: ${persona.ultima_ubicacion}\nFecha de desaparición: ${formatFecha(persona.fecha_desaparicion)}\n\nReportado por: ${persona.reportante_nombre} (${persona.reportante_telefono})`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const formatFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return fecha;
    }
  };

  const getEstadoBadge = (estado: string) => {
    if (estado === 'missing') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 border border-red-300">
          <AlertCircle className="h-4 w-4" />
          Por localizar
        </span>
      );
    }
    if (estado === 'found') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-300">
          Localizada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-300">
        Identificada
      </span>
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Drawer - menos de la mitad del ancho */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transition-transform duration-200 ease-out overflow-y-auto ${
          mounted ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: 'min(480px, 45vw)' }}
      >
        {persona && (
          <div className="flex flex-col h-full">
            {/* Header con cerrar */}
            <div className="sticky top-0 bg-white border-b z-10 px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Detalle de la persona</h3>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Foto grande */}
            {persona.foto_url ? (
              <div className="w-full bg-gray-100">
                <img
                  src={persona.foto_url}
                  alt={`${persona.nombre} ${persona.apellido}`}
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                <User className="h-24 w-24 text-gray-300" />
              </div>
            )}

            {/* Contenido */}
            <div className="flex-1 p-6 space-y-6">
              {/* Nombre y estado */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">
                    {persona.nombre} {persona.apellido}
                  </h2>
                  {getEstadoBadge(persona.estado)}
                </div>
                <p className="text-gray-600">
                  {persona.edad ? `${persona.edad} años` : 'Edad no especificada'} · {persona.genero === 'femenino' ? 'Femenino' : persona.genero === 'masculino' ? 'Masculino' : 'Otro'}
                </p>
                {persona.badge === 'verde' && (
                  <p className="inline-flex items-center gap-1 mt-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                    ✓ Reporte verificado oficialmente
                  </p>
                )}
              </div>

              {/* Información clave */}
              <div className="space-y-3 border-y py-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Última ubicación conocida</p>
                    <p className="font-medium">{persona.ultima_ubicacion}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fecha de desaparición</p>
                    <p className="font-medium">{formatFecha(persona.fecha_desaparicion)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Reportado</p>
                    <p className="font-medium">{formatFecha(persona.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {persona.descripcion && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Descripción</p>
                  <p className="text-gray-700 leading-relaxed">{persona.descripcion}</p>
                </div>
              )}

              {/* Datos del reportante */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Reportado por</p>
                    <p className="font-medium">{persona.reportante_nombre}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                    {persona.reportante_relacion.replace(/-/g, ' ')}
                  </span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href={`tel:${persona.reportante_telefono}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    {persona.reportante_telefono}
                  </a>
                </Button>
              </div>
            </div>

              {/* Disclaimer contextual */}
              {persona.estado === 'missing' && (
                <div className="mx-6 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800">
                    <strong>¿Viste a esta persona?</strong> Podés aportar información usando el botón de abajo. No intentes contactarla directamente si no estás seguro.
                    Si la encontraste, contactá al reportante o a{' '}
                    <a
                      href="https://www.defensacivil.gov.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      Defensa Civil
                    </a>
                    .
                  </p>
                </div>
              )}

              {/* Footer con acciones */}
            <div className="sticky bottom-0 bg-white border-t p-4 flex gap-2">
              <Button className="flex-1" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href={`https://wa.me/${persona.reportante_telefono.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
