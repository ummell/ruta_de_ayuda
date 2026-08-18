'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MapPin, Phone, Package, Clock } from 'lucide-react';

export default function NuevoCentroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    queNecesitan: '',
    horarios: '',
    telefono: '',
    whatsapp: '',
  });

  const validate = (): string => {
    if (!formData.nombre.trim()) return 'Nombre del centro es requerido';
    if (!formData.direccion.trim()) return 'Dirección es requerida';
    if (!formData.ciudad.trim()) return 'Ciudad es requerida';
    if (!formData.queNecesitan.trim()) return 'Qué necesitan es requerido';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/centros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          queNecesitan: formData.queNecesitan,
          horarios: formData.horarios || null,
          telefono: formData.telefono || null,
          whatsapp: formData.whatsapp || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al registrar el centro');
      }

      router.push('/centros');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Registrar Centro de Acopio</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Datos del Centro
            </CardTitle>
            <CardDescription>
              Información del centro de acopio y distribución
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del centro *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Centro de Acopio Central"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Calle, número, barrio"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ciudad">Ciudad *</Label>
              <Input
                id="ciudad"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="queNecesitan">Qué necesitan *</Label>
              <textarea
                id="queNecesitan"
                className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder=" Agua potable, alimentos no perecederos, ropa, medicamentos, etc."
                value={formData.queNecesitan}
                onChange={(e) => setFormData({ ...formData, queNecesitan: e.target.value })}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horarios y Contacto
            </CardTitle>
            <CardDescription>
              Cuándo pueden recibir donaciones y cómo contactarlos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="horarios">Horarios de atención</Label>
              <Input
                id="horarios"
                value={formData.horarios}
                onChange={(e) => setFormData({ ...formData, horarios: e.target.value })}
                placeholder="Ej: Lunes a viernes 8am - 5pm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="3001234567"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="3001234567"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar Centro'}
          </Button>
        </div>
      </form>
    </div>
  );
}
