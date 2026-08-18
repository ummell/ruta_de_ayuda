'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, MapPin, Phone, Users, Home } from 'lucide-react';
import { VerifyBadge, VerifyBadgeWithDescription } from '@/components/ui/verify-badge';

interface Albergue {
  id: string;
  nombre_voluntario: string;
  telefono: string;
  whatsapp?: string | null;
  direccion: string;
  ciudad: string;
  capacidad: number;
  servicios?: string | null;
  reglas?: string | null;
  foto_url?: string | null;
  badge: string;
  estado: string;
  created_at: string;
}

export default function AlberguesPage() {
  const [albergues, setAlbergues] = useState<Albergue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ciudadFiltro, setCiudadFiltro] = useState('');
  const [badgeFiltro, setBadgeFiltro] = useState('');

  const fetchAlbergues = async () => {
    try {
      const res = await fetch('/api/albergues', { cache: 'no-store' });
      const data = await res.json();
      setAlbergues(data.albergues || []);
    } catch (err) {
      console.error('Error cargando albergues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbergues();
  }, []);

  const alberguesFiltrados = albergues.filter((a) => {
    const matchNombre = a.nombre_voluntario.toLowerCase().includes(search.toLowerCase());
    const matchCiudad = !ciudadFiltro || a.ciudad.toLowerCase().includes(ciudadFiltro.toLowerCase());
    const matchBadge = !badgeFiltro || a.badge === badgeFiltro;
    return matchNombre && matchCiudad && matchBadge;
  });

  const whatsappLink = (phone: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${clean}`;
  };

  const formatCapacidad = (cap: number) => {
    return `${cap} persona${cap !== 1 ? 's' : ''}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Albergues y Refugios</h1>
          <p className="text-gray-600">
            {albergues.length === 0
              ? 'Lugares de hospedaje para afectados por el terremoto'
              : `${albergues.length} refugio${albergues.length !== 1 ? 's' : ''} disponible${albergues.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button asChild>
          <Link href="/albergues/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Ofrecer Hospedaje
          </Link>
        </Button>
      </div>

      {/* Legend */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <VerifyBadgeWithDescription type="verde" />
        <VerifyBadgeWithDescription type="amarillo" />
        <VerifyBadgeWithDescription type="azul" />
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre del voluntario..."
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
            <select
              className="h-10 px-3 rounded-md border border-gray-300 bg-white md:w-48"
              value={badgeFiltro}
              onChange={(e) => setBadgeFiltro(e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="verde">Verificado Alto</option>
              <option value="amarillo">Avalado</option>
              <option value="azul">Voluntario Hogar</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : alberguesFiltrados.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            {albergues.length === 0
              ? 'No hay albergues registrados. Ofrece tu hogar para ayudar.'
              : 'No se encontraron resultados con esos filtros.'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alberguesFiltrados.map((albergue) => (
            <Card key={albergue.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {albergue.foto_url ? (
                <div className="w-full h-48 bg-gray-100">
                  <img
                    src={albergue.foto_url}
                    alt={albergue.nombre_voluntario}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <Home className="h-16 w-16 text-gray-300" />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{albergue.nombre_voluntario}</h3>
                  <VerifyBadge type={albergue.badge as 'verde' | 'amarillo' | 'azul'} showLabel={false} />
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{albergue.direccion}, {albergue.ciudad}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Capacidad: {formatCapacidad(albergue.capacidad)}</span>
                  </div>
                  {albergue.servicios && (
                    <p className="text-gray-600 text-sm">{albergue.servicios}</p>
                  )}
                  {albergue.reglas && (
                    <p className="text-gray-500 text-xs italic">Reglas: {albergue.reglas}</p>
                  )}
                  {albergue.badge === 'azul' && (
                    <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded mt-2">
                      ⚠️ No es un albergue oficial. Verifica con una llamada antes de ir.
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={`tel:${albergue.telefono}`}>
                      <Phone className="h-3 w-3 mr-1" />
                      Llamar
                    </a>
                  </Button>
                  {albergue.whatsapp && (
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={whatsappLink(albergue.whatsapp)} target="_blank" rel="noopener noreferrer">
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
