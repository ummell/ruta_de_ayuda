import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Phone,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { OfficialLinks } from '@/components/official-links';
import { CommunityMap } from '@/components/community-map';

export default function InfoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Guía Post-Terremoto</h1>

      <div className="space-y-12">
        {/* Alerta de emergencia */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Si estás en peligro inmediato, llama al 123.</strong>
            Esta guía no sustituye las indicaciones de Protección Civil y autoridades.
          </AlertDescription>
        </Alert>

        {/* Durante el Sismo */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Durante el Sismo
          </h2>
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Mantén la calma.</strong> El pánico causa más accidentes que el temblor mismo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Aléjate de ventanas y objetos que puedan caer.</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Si estás dentro, quédate bajo un mueble sólido</strong> (mesa, escritorio) hasta que pare.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Si estás afuera, aléjate de edificios, postes y cables.</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>No uses ascensores.</strong></span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Después del Sismo */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Después del Sismo
          </h2>
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li>1. Verifica si alguien está herido y necesita ayuda</li>
                <li>2. Si hay personas heridas, llama al 123 o 132 (Cruz Roja)</li>
                <li>3. Revisa tu hogar por daños estructurales antes de entrar</li>
                <li>4. Ten cuidado con vidrios rotos y objetos caídos</li>
                <li>5. No enciendas fósforos ni encendedores — podría haber gas</li>
                <li>6. Escucha la radio o canales oficiales para información</li>
                <li>7. Prepárate para réplicas (temblores más pequeños)</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Qué NO hacer */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Qué NO hacer
          </h2>
          <Card className="border-destructive/50">
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold flex-shrink-0">✗</span>
                  <span>No llevar ropa usada sin que la pidan.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold flex-shrink-0">✗</span>
                  <span>No enviar alimentos perecederos ni medicamentos sin control de fecha.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold flex-shrink-0">✗</span>
                  <span>
                    No desplazarse a la zona por cuenta propia: satura vías que la respuesta necesita.
                    Inscribete en{' '}
                    <a
                      href="https://portal.gestiondelriesgo.gov.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Defensa Civil
                    </a>{' '}
                    antes de ir.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold flex-shrink-0">✗</span>
                  <span>
                    No transferir dinero a cuentas que no figuren en la web oficial de la organización.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold flex-shrink-0">✗</span>
                  <span>
                    No difundir información sin verificar — usá el{' '}
                    <a href="/verificar" className="text-primary hover:underline font-medium">
                      Centro de Verificación
                    </a>
                    .
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Teléfonos de Emergencia */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Phone className="h-6 w-6" />
            Teléfonos de Emergencia
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold">123</div>
                <div className="text-sm text-muted-foreground">Línea de Emergencia</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold">144</div>
                <div className="text-sm text-muted-foreground">Defensa Civil</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold">132</div>
                <div className="text-sm text-muted-foreground">Cruz Roja</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold">119</div>
                <div className="text-sm text-muted-foreground">Bomberos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold">112</div>
                <div className="text-sm text-muted-foreground">Policía Nacional</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mapa Comunitario */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Mapa en tiempo real
          </h2>
          <CommunityMap />
        </section>

        {/* Fuentes Oficiales */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ExternalLink className="h-6 w-6" />
            Fuentes Oficiales
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Enlaces verificados a canales oficiales. Cada organización mantiene su propia información.
          </p>
          <OfficialLinks />
        </section>

        {/* Enlaces Oficiales legacy */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Enlaces Institucionales
          </h2>
          <Card>
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.defensacivil.gov.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Defensa Civil Colombiana <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.cruzrojacolombiana.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Cruz Roja Colombiana <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.sgc.gov.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Servicio Geológico Colombiano (Sismología) <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://earthquake.usgs.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    USGS — Sismología en tiempo real <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://portal.gestiondelriesgo.gov.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    UNGRD — Unidad Nacional para la Gestión del Riesgo <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
