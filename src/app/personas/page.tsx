'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, MapPin, Phone, User, Calendar, Clock } from 'lucide-react';
import { PersonaDetailDrawer } from '@/components/persona-detail-drawer';
import { formatTiempoRelativo } from '@/lib/utils';

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

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ciudadFiltro, setCiudadFiltro] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  const fetchPersonas = async () => {
    try {
      const res = await fetch('/api/personas', { cache: 'no-store' });
      const data = await res.json();
      setPersonas(data.personas || []);
    } catch (err) {
      console.error('Error cargando personas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  const personasFiltradas = personas.filter((p) => {
    const matchNombre = `${p.nombre} ${p.apellido}`.toLowerCase().includes(search.toLowerCase());
    const matchCiudad = !ciudadFiltro || p.ultima_ubicacion.toLowerCase().includes(ciudadFiltro.toLowerCase());
    return matchNombre && matchCiudad;
  });

  const formatFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Personas Desaparecidas</h1>
          <p className="text-gray-600">
            {personas.length === 0
              ? 'Registra y busca personas afectadas por el terremoto'
              : `${personas.length} persona${personas.length !== 1 ? 's' : ''} reportada${personas.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button asChild>
          <Link href="/personas/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Reportar Persona
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Input
              placeholder="Ciudad o zona"
              className="md:w-48"
              value={ciudadFiltro}
              onChange={(e) => setCiudadFiltro(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          <p>Cargando...</p>
        </div>
      ) : personasFiltradas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            {personas.length === 0
              ? 'No hay registros aún. Sé el primero en reportar una persona.'
              : 'No se encontraron resultados con esos filtros.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personasFiltradas.map((persona) => (
            <Card
              key={persona.id}
              className="hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              onClick={() => setSelectedPersona(persona)}
            >
              {persona.foto_url ? (
                <div className="w-full h-64 bg-gray-100">
                  <img
                    src={persona.foto_url}
                    alt={`${persona.nombre} ${persona.apellido}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                  <User className="h-20 w-20 text-gray-300" />
                </div>
              )}
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">
                    {persona.nombre} {persona.apellido}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {persona.edad ? `${persona.edad} años` : 'Edad no especificada'}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{persona.ultima_ubicacion}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Desaparición: {formatFecha(persona.fecha_desaparicion)}
                    </span>
                  </div>
                  {persona.descripcion && (
                    <p className="text-gray-600 italic text-xs pt-2 border-t">
                      {persona.descripcion}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-1">Reportado por:</p>
                  <p className="text-sm font-medium">{persona.reportante_nombre}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="h-3 w-3" />
                    <span>{persona.reportante_telefono}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span title={new Date(persona.created_at).toLocaleString('es-CO')}>
                      {formatTiempoRelativo(persona.created_at)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${persona.reportante_telefono}`;
                    }}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Llamar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      const text = `Ayuda a encontrar a ${persona.nombre} ${persona.apellido}. Última ubicación: ${persona.ultima_ubicacion}`;
                      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                      window.open(url, '_blank');
                    }}
                  >
                    Compartir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Drawer de detalle */}
      <PersonaDetailDrawer
        persona={selectedPersona}
        onClose={() => setSelectedPersona(null)}
      />
    </div>
  );
}
