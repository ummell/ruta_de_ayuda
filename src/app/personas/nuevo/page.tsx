'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, Phone, User, X, Edit3 } from 'lucide-react';
import { ImageEditor } from '@/components/image-editor';
import type { PersonaInput } from '@/lib/validations';

export default function NuevoPersonaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    genero: 'sin-especificar',
    ciudad: '',
    ultimaUbicacion: '',
    fechaDesaparicion: '',
    descripcion: '',
    reportanteNombre: '',
    reportanteTelefono: '',
    reportanteEmail: '',
    reportanteRelacion: 'familiar' as PersonaInput['reportanteRelacion'],
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  // Limpiar el object URL cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    };
  }, [fotoPreview]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es muy grande. Máximo 5MB.');
      e.target.value = '';
      return;
    }

    // Validar tipo
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato no válido. Solo JPG, PNG o WebP.');
      e.target.value = '';
      return;
    }

    // Abrir editor para que el usuario pueda recortar/ajustar
    setPendingImage(file);
    setError('');
  };

  const handleEditorConfirm = (croppedFile: File) => {
    setFoto(croppedFile);
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoPreview(URL.createObjectURL(croppedFile));
    setPendingImage(null);
    // Resetear el input file
    const fileInput = document.getElementById('foto') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleEditorCancel = () => {
    setPendingImage(null);
    const fileInput = document.getElementById('foto') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleReEdit = () => {
    if (foto) {
      setPendingImage(foto);
    }
  };

  const handleQuitarFoto = () => {
    setFoto(null);
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoPreview(null);
    const fileInput = document.getElementById('foto') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const validate = (): string => {
    if (!formData.nombre.trim()) return 'Nombre es requerido';
    if (!formData.apellido.trim()) return 'Apellido es requerido';
    if (!formData.ciudad.trim()) return 'Ciudad es requerida';
    if (!formData.ultimaUbicacion.trim()) return 'Última ubicación conocida es requerida';
    if (!formData.fechaDesaparicion.trim()) return 'Fecha de desaparición es requerida';
    if (!formData.reportanteNombre.trim()) return 'Tu nombre completo es requerido';
    if (!formData.reportanteTelefono.trim()) return 'Teléfono es requerido';
    if (!formData.reportanteEmail.trim()) return 'Email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reportanteEmail)) return 'Email inválido';
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
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('apellido', formData.apellido);
      formDataToSend.append('edad', formData.edad);
      formDataToSend.append('genero', formData.genero);
      formDataToSend.append('ciudad', formData.ciudad);
      formDataToSend.append('ultimaUbicacion', formData.ultimaUbicacion);
      formDataToSend.append('fechaDesaparicion', formData.fechaDesaparicion);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('reportanteNombre', formData.reportanteNombre);
      formDataToSend.append('reportanteTelefono', formData.reportanteTelefono);
      formDataToSend.append('reportanteEmail', formData.reportanteEmail);
      formDataToSend.append('reportanteRelacion', formData.reportanteRelacion);
      if (foto) formDataToSend.append('foto', foto);

      const response = await fetch('/api/personas', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al registrar');
      }

      router.push('/personas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Reportar Persona Desaparecida</h1>

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
              <User className="h-5 w-5" />
              Datos de la Persona
            </CardTitle>
            <CardDescription>
              Información de la persona que estás reportando
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Foto con preview - misma proporción que la card */}
            <div className="space-y-2">
              <Label htmlFor="foto">Foto</Label>
              <p className="text-xs text-gray-500">
                La foto se mostrará en formato grande en la lista. Usa una imagen donde la cara se vea bien.
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
                    Así se va a ver la foto en la lista. {foto?.name} ({((foto?.size || 0) / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  <p className="text-xs text-amber-600 font-medium">
                    Tip: Usa el botón &quot;Editar&quot; para mover, hacer zoom o rotar la imagen y centrarla bien.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="w-full h-64 bg-gray-50 border-2 border-dashed rounded-lg flex items-center justify-center mb-2">
                    <div className="text-center">
                      <User className="h-16 w-16 mx-auto mb-2 text-gray-300" />
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
                  <p className="text-xs text-gray-500 mt-2">
                    Después de subir, podrás mover, hacer zoom y rotar la imagen antes de guardar.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Edad y Género (sin Documento) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edad">Edad</Label>
                <Input
                  id="edad"
                  type="number"
                  min="0"
                  max="120"
                  value={formData.edad}
                  onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Género</Label>
                <select
                  id="genero"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={formData.genero}
                  onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                >
                  <option value="sin-especificar">Sin especificar</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="fechaDesaparicion">Fecha de desaparición *</Label>
                <Input
                  id="fechaDesaparicion"
                  type="date"
                  value={formData.fechaDesaparicion}
                  onChange={(e) => setFormData({ ...formData, fechaDesaparicion: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ultimaUbicacion">Última ubicación conocida *</Label>
              <Input
                id="ultimaUbicacion"
                placeholder="Barrio, zona, dirección"
                value={formData.ultimaUbicacion}
                onChange={(e) => setFormData({ ...formData, ultimaUbicacion: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción adicional</Label>
              <textarea
                id="descripcion"
                className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Señas particulares, ropa que vestía, etc."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Datos del Reportante
            </CardTitle>
            <CardDescription>
              Tu información de contacto para que puedan comunicarse contigo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportanteNombre">Tu nombre completo *</Label>
              <Input
                id="reportanteNombre"
                value={formData.reportanteNombre}
                onChange={(e) => setFormData({ ...formData, reportanteNombre: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportanteTelefono">Teléfono *</Label>
                <Input
                  id="reportanteTelefono"
                  type="tel"
                  placeholder="3001234567"
                  value={formData.reportanteTelefono}
                  onChange={(e) => setFormData({ ...formData, reportanteTelefono: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportanteEmail">Email *</Label>
                <Input
                  id="reportanteEmail"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={formData.reportanteEmail}
                  onChange={(e) => setFormData({ ...formData, reportanteEmail: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500">
                  Te enviaremos un enlace para marcar el reporte como encontrada.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportanteRelacion">Relación</Label>
                <select
                  id="reportanteRelacion"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={formData.reportanteRelacion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reportanteRelacion: e.target.value as PersonaInput['reportanteRelacion'],
                    })
                  }
                >
                  <option value="familiar">Familiar</option>
                  <option value="madre-padre">Madre/Padre</option>
                  <option value="hijo-hija">Hijo/Hija</option>
                  <option value="hermano-hermana">Hermano/Hermana</option>
                  <option value="abuelo-abuela">Abuelo/Abuela</option>
                  <option value="nieto-nieta">Nieto/Nieta</option>
                  <option value="tio-tia">Tío/Tía</option>
                  <option value="sobrino-sobrina">Sobrino/Sobrina</option>
                  <option value="primo-prima">Primo/Prima</option>
                  <option value="esposo-esposa">Esposo/Esposa</option>
                  <option value="pareja">Pareja</option>
                  <option value="amigo-amiga">Amigo/Amiga</option>
                  <option value="vecino">Vecino</option>
                  <option value="conocido">Conocido</option>
                  <option value="colega-trabajo">Colega de trabajo</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar Reporte'}
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
