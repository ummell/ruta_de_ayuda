'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, MapPin, Phone, Package, Clock } from 'lucide-react';
import { VerifyBadge } from '@/components/ui/verify-badge';

interface Centro {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  necesidades: string;
  horarios?: string | null;
  telefono?: string | null;
  whatsapp?: string | null;
  badge: string;
  created_at: string;
}

export default function CentrosPage() {
  const [centros, setCentros] = useState<Centro[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ciudadFiltro, setCiudadFiltro] = useState('');

  const fetchCentros = async () => {
    try {
      const res = await fetch('/api/centros', { cache: 'no-store' });
      const data = await res.json();
      setCentros(data.centros || []);
    } catch (err) {
      console.error('Error cargando centros:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentros();
  }, []);

  const centrosFiltrados = centros.filter((c) => {
    const matchNombre = c.nombre.toLowerCase().includes(search.toLowerCase());
    const matchCiudad = !ciudadFiltro || c.ciudad.toLowerCase().includes(ciudadFiltro.toLowerCase());
    return matchNombre && matchCiudad;
  });

  const whatsappLink = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${clean}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Centros de Acopio</h1>
          <p className="text-gray-600">
            {centros.length === 0
              ? 'Puntos de ayuda para donate y recibir asistencia'
              : `${centros.length} centro${centros.length !== 1 ? 's' : ''} registrado${centros.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button asChild>
          <Link href="/centros/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Centro
          </Link>
        </Button>
      </div>

      {/* Search */}
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
              placeholder="Ciudad"
              className="md:w-48"
              value={ciudadFiltro}
              onChange={(e) => setCiudadFiltro(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : centrosFiltrados.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            {centros.length === 0
              ? 'No hay centros registrados. Sé el primero en registrar uno.'
              : 'No se encontraron resultados con esos filtros.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centrosFiltrados.map((centro) => (
            <Card key={centro.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg flex-1 pr-2">{centro.nombre}</h3>
                  <VerifyBadge type={centro.badge as 'verde' | 'amarillo' | 'azul'} showLabel={false} />
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{centro.direccion}, {centro.ciudad}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{centro.necesidades}</span>
                  </div>
                  {centro.horarios && (
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{centro.horarios}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {centro.telefono && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`tel:${centro.telefono}`}>
                        <Phone className="h-3 w-3 mr-1" />
                        Llamar
                      </a>
                    </Button>
                  )}
                  {centro.whatsapp && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={whatsappLink(centro.whatsapp)} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
