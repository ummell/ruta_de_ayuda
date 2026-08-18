'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VerifyBadgeWithDescription } from '@/components/ui/verify-badge';
import { ImageEditor } from '@/components/image-editor';
import { AlertCircle, Upload, Phone, MapPin, User, X, Edit3 } from 'lucide-react';

export default function NuevoAlberguePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    voluntarioNombre: '',
    telefono: '',
    whatsapp: '',
    direccion: '',
    ciudad: '',
    capacidad: '',
    servicios: '',
    reglas: '',
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es muy grande. Máximo 5MB.');
      e.target.value = '';
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato no válido. Solo JPG, PNG o WebP.');
      e.target.value = '';
      return;
    }

    // Abrir editor antes de establecer la foto
    setPendingImage(file);
    setError('');
  };

  const handleEditorConfirm = (croppedFile: File) => {
    setFoto(croppedFile);
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoPreview(URL.createObjectURL(croppedFile));
    setPendingImage(null);
    const fileInput = document.getElementById('foto') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleEditorCancel = () => {
    setPendingImage(null);
    const fileInput = document.getElementById('foto') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleReEdit = () => {
    if (foto) setPendingImage(foto);
  };

  const handleQuitarFoto = () => {
    setFoto(null);
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoPreview(null);
    const fileInput = document.getElementById('foto') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const validate = (): string => {
    if (!formData.voluntarioNombre.trim()) return 'Nombre del voluntario es requerido';
    if (!formData.telefono.trim()) return 'Teléfono es requerido';
    if (!formData.direccion.trim()) return 'Dirección es requerida';
    if (!formData.ciudad.trim()) return 'Ciudad es requerida';
    if (!formData.capacidad.trim()) return 'Capacidad es requerida';
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
      const formDataToSend = new FormData();
      formDataToSend.append('voluntarioNombre', formData.voluntarioNombre);
      formDataToSend.append('telefono', formData.telefono);
      formDataToSend.append('whatsapp', formData.whatsapp || '');
      formDataToSend.append('direccion', formData.direccion);
      formDataToSend.append('ciudad', formData.ciudad);
      formDataToSend.append('capacidad', formData.capacidad);
      formDataToSend.append('servicios', formData.servicios || '');
      formDataToSend.append('reglas', formData.reglas || '');
      if (foto) formDataToSend.append('foto', foto);

      const response = await fetch('/api/albergues', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al registrar el albergue');
      }

      router.push('/albergues');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Registrar Albergue</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VerifyBadgeWithDescription type="verde" />
          <VerifyBadgeWithDescription type="amarillo" />
          <VerifyBadgeWithDescription type="azul" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Datos del Voluntario
            </CardTitle>
            <CardDescription>
              Tu información de contacto como voluntario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voluntarioNombre">Nombre completo del voluntario *</Label>
              <Input
                id="voluntarioNombre"
                value={formData.voluntarioNombre}
                onChange={(e) => setFormData({ ...formData, voluntarioNombre: e.target.value })}
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="3001234567"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación
            </CardTitle>
            <CardDescription>
              Dónde se encuentra el albergue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Foto del Lugar
            </CardTitle>
            <CardDescription>
              Una imagen del albergue ayuda a que las personas se orienten
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-gray-500">
              Opcional. Muestra cómo llegar o el espacio disponible.
            </p>
            {fotoPreview ? (
              <div className="space-y-2">
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-300">
                  <img
                    src={fotoPreview}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleReEdit}
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleQuitarFoto}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Quitar
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {foto?.name} ({((foto?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                </p>
                <p className="text-xs text-amber-600 font-medium">
                  Tip: Usa &quot;Editar&quot; para mover, hacer zoom o rotar la imagen.
                </p>
              </div>
            ) : (
              <div>
                <div className="w-full h-64 bg-gray-50 border-2 border-dashed rounded-lg flex items-center justify-center mb-2">
                  <div className="text-center">
                    <Upload className="h-16 w-16 mx-auto mb-2 text-gray-300" />
                    <p className="text-xs text-gray-400">Vista previa</p>
                    <p className="text-xs text-gray-400">256px de alto</p>
                  </div>
                </div>
                <input
                  type="file"
                  id="foto"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="foto"
                  className="cursor-pointer inline-flex items-center justify-center w-full h-10 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Subir foto (JPG, PNG o WebP, máx 5MB)
                </label>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Detalles del Albergue
            </CardTitle>
            <CardDescription>
              Capacidad, servicios y reglas del lugar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="capacidad">Capacidad (personas) *</Label>
              <Input
                id="capacidad"
                type="number"
                min="1"
                value={formData.capacidad}
                onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="servicios">Servicios</Label>
              <textarea
                id="servicios"
                className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Alimentación, agua, baños, duchas, electricidad, etc."
                value={formData.servicios}
                onChange={(e) => setFormData({ ...formData, servicios: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reglas">Reglas</Label>
              <textarea
                id="reglas"
                className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Horarios, restricciones, mascotas, etc."
                value={formData.reglas}
                onChange={(e) => setFormData({ ...formData, reglas: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar Albergue'}
          </Button>
        </div>
      </form>

      {/* Editor modal */}
      {pendingImage && (
        <ImageEditor
          imageFile={pendingImage}
          onConfirm={handleEditorConfirm}
          onCancel={handleEditorCancel}
          aspectRatio={16 / 10}
        />
      )}
    </div>
  );
}
