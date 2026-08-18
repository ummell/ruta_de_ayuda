import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeAlert, MapPin, Shield, CheckCircle, Phone, Info, ExternalLink, Megaphone } from 'lucide-react';
import { EstadoOperativo } from '@/components/estado-operativo';
import { OfficialLinks } from '@/components/official-links';
import { PublicacionesSection } from '@/components/publicaciones-section';
import { CommunityMap } from '@/components/community-map';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Estado Operativo */}
      <section className="bg-slate-50 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-900">
            <BadgeAlert className="h-5 w-5 text-red-600" />
            Estado operativo de la emergencia
          </h2>
          <EstadoOperativo />
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-amber-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Image
            src="/logo_ruta_ayuda_tranparente.png"
            alt="RutaDeAyuda"
            width={120}
            height={120}
            className="mx-auto h-24 w-24 md:h-32 md:w-32 mb-6"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-blue-900">
            Terremoto en Colombia
          </h1>
          <p className="text-sm font-semibold text-red-600 mb-4">
            ● EN VIVO — M7.4 San José del Palmar, Chocó
          </p>
          <p className="text-xl text-slate-600 mb-8">
            Estamos conectando ayuda con quienes la necesitan.
            Registra y busca personas, centros de acopio y albergues.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full bg-red-600 hover:bg-red-700">
              <Link href="/personas">Buscar Personas</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-slate-300 text-blue-900 hover:bg-blue-50 hover:text-blue-900"
            >
              <Link href="/centros">Centros de Acopio</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-slate-300 text-blue-900 hover:bg-blue-50 hover:text-blue-900"
            >
              <Link href="/albergues">Albergues</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center mb-2">
                  <MapPin className="h-5 w-5 text-blue-900" />
                </div>
                <CardTitle className="text-blue-900">Personas Desaparecidas</CardTitle>
                <CardDescription>
                  Registra y busca personas afectadas por el terremoto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full rounded-full bg-red-600 hover:bg-red-700">
                  <Link href="/personas/nuevo">Reportar Persona</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center mb-2">
                  <Shield className="h-5 w-5 text-blue-900" />
                </div>
                <CardTitle className="text-blue-900">Centros y Albergues</CardTitle>
                <CardDescription>
                  Encuentra centros de acopio y lugares de refugio
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 rounded-full border-slate-300 text-blue-900 hover:bg-blue-50 hover:text-blue-900"
                >
                  <Link href="/centros">Centros</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 rounded-full border-slate-300 text-blue-900 hover:bg-blue-50 hover:text-blue-900"
                >
                  <Link href="/albergues">Albergues</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardHeader>
                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-900" />
                </div>
                <CardTitle className="text-blue-900">Verificar Información</CardTitle>
                <CardDescription>
                  Confirma si una información es verdadera antes de compartir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full border-slate-300 text-blue-900 hover:bg-blue-50 hover:text-blue-900"
                >
                  <Link href="/verificar">Verificar</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comunicados Oficiales */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6 flex-wrap">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-900">
              <Megaphone className="h-6 w-6 text-red-600" />
              Últimos comunicados oficiales
            </h2>
            <p className="text-sm text-slate-500">
              Curado a mano · actualizado periódicamente
            </p>
          </div>
          <PublicacionesSection />
        </div>
      </section>

      {/* Mapa Comunitario */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-900">
            <MapPin className="h-6 w-6 text-red-600" />
            Mapa en tiempo real
          </h2>
          <CommunityMap />
        </div>
      </section>

      {/* Fuentes Oficiales */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-blue-900">
              <ExternalLink className="h-6 w-6 text-red-600" />
              Fuentes Oficiales
            </h2>
            <p className="text-sm text-slate-500">
              Cada organización mantiene su propia información
            </p>
          </div>
          <OfficialLinks />
        </div>
      </section>

      {/* Emergency Numbers */}
      <section className="bg-blue-900 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 text-white">
            <Phone className="h-6 w-6" />
            Líneas de Emergencia
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold text-amber-400">123</div>
              <div className="text-sm text-slate-300">Línea de Emergencia</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold text-amber-400">144</div>
              <div className="text-sm text-slate-300">Defensa Civil</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold text-amber-400">132</div>
              <div className="text-sm text-slate-300">Cruz Roja</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold text-amber-400">119</div>
              <div className="text-sm text-slate-300">Bomberos</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <div className="text-2xl font-bold text-amber-400">112</div>
              <div className="text-sm text-slate-300">Policía Nacional</div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Links */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Button asChild variant="ghost" size="lg" className="rounded-full text-blue-900 hover:bg-blue-50">
            <Link href="/info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Guía Post-Terremoto y Más Información
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
