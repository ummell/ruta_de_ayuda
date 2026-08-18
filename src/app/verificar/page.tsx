'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, HelpCircle, Search, Shield, AlertTriangle, Users, MapPin, Home } from 'lucide-react';

type Resultado = 'verificado' | 'no_encontrado' | 'conflicto' | null;

interface PersonaCoincidencia {
  id: string;
  nombre: string;
  apellido: string;
  ultima_ubicacion: string;
}

interface CentroCoincidencia {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
}

interface AlbergueCoincidencia {
  id: string;
  nombre_voluntario: string;
  direccion: string;
  ciudad: string;
}

interface Coincidencia {
  personas: PersonaCoincidencia[];
  centros: CentroCoincidencia[];
  albergues: AlbergueCoincidencia[];
}

export default function VerificarPage() {
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<Resultado>(null);
  const [mensaje, setMensaje] = useState('');
  const [detalle, setDetalle] = useState('');
  const [coincidencias, setCoincidencias] = useState<Coincidencia>({ personas: [], centros: [], albergues: [] });

  const handleVerificar = async () => {
    if (texto.length < 10) return;

    setLoading(true);
    try {
      const response = await fetch('/api/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto }),
      });

      const data = await response.json();
      setResultado(data.resultado);
      setMensaje(data.mensaje || '');
      setDetalle(data.detalle || '');
      setCoincidencias(data.data || { personas: [], centros: [], albergues: [] });
    } catch {
      setResultado('no_encontrado');
      setMensaje('Error al verificar. Intenta de nuevo.');
      setDetalle('');
      setCoincidencias({ personas: [], centros: [], albergues: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Centro de Verificación</h1>
      <p className="text-gray-600 mb-8">
        Verifica si una información sobre el terremoto es verdadera antes de compartirla
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            ¿Qué quieres verificar?
          </CardTitle>
          <CardDescription>
            Pega texto, enlace o describe lo que escuchaste
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="texto">Texto o descripción</Label>
            <textarea
              id="texto"
              className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              placeholder="Ej: 'Albergue en el parque central de Cali' o 'Centro de acopio en la carrera 5'"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </div>
          <Button
            onClick={handleVerificar}
            disabled={texto.length < 10 || loading}
            className="w-full"
          >
            {loading ? 'Verificando...' : 'Verificar'}
          </Button>
        </CardContent>
      </Card>

      {resultado && (
        <Card className={`mb-8 ${
          resultado === 'verificado' ? 'border-green-500' :
          resultado === 'conflicto' ? 'border-red-500' : 'border-yellow-500'
        }`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {resultado === 'verificado' && (
                <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
              )}
              {resultado === 'conflicto' && (
                <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
              )}
              {resultado === 'no_encontrado' && (
                <HelpCircle className="h-8 w-8 text-yellow-500 flex-shrink-0" />
              )}

              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {resultado === 'verificado' && '✅ Verificado'}
                  {resultado === 'conflicto' && '❌ Conflicto Encontrado'}
                  {resultado === 'no_encontrado' && '⚠️ No Podemos Verificar'}
                </h3>
                <p className="text-gray-700 mb-2">{mensaje}</p>
                {detalle && (
                  <p className="text-sm text-gray-500">{detalle}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Coincidencias */}
      {resultado === 'verificado' && (
        <div className="space-y-4 mb-8">
          {coincidencias.personas.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" />
                  Personas encontradas ({coincidencias.personas.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {coincidencias.personas.map((p) => (
                  <div key={p.id} className="border-b pb-2 last:border-0">
                    <p className="font-medium">{p.nombre} {p.apellido}</p>
                    <p className="text-sm text-gray-500">{p.ultima_ubicacion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {coincidencias.centros.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4" />
                  Centros de acopio ({coincidencias.centros.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {coincidencias.centros.map((c) => (
                  <div key={c.id} className="border-b pb-2 last:border-0">
                    <p className="font-medium">{c.nombre}</p>
                    <p className="text-sm text-gray-500">{c.direccion}, {c.ciudad}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {coincidencias.albergues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Home className="h-4 w-4" />
                  Albergues ({coincidencias.albergues.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {coincidencias.albergues.map((a) => (
                  <div key={a.id} className="border-b pb-2 last:border-0">
                    <p className="font-medium">{a.nombre_voluntario}</p>
                    <p className="text-sm text-gray-500">{a.direccion}, {a.ciudad}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">¿Por qué verificar?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">En emergencias circulan noticias falsas</p>
              <p className="text-sm text-gray-500">
                Personas malintencionadas pueden compartir información falsa sobre centros de acopio, albergues o personas para aprovecharse de la situación.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Verificar protege a todos</p>
              <p className="text-sm text-gray-500">
                Antes de compartir información, verifica aquí. Así evitas pánicо y ayudas a que la ayuda llegue a quien realmente la necesita.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
