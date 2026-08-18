import { MapPin, ExternalLink, Users } from 'lucide-react';

export function CommunityMap() {
  return (
    <div className="bg-card rounded-lg border p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Mapa comunitario de emergencia
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Visualiza en tiempo real dónde se necesita ayuda, dónde hay cobertura y
            qué llevar. Datos aportados por la comunidad y confirmados sobre la marcha.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Sitio comunitario no oficial.</strong> La información es reportada por usuarios en
          tiempo real y puede no estar verificada. Confirmá siempre antes de actuar y priorizá los
          canales oficiales ante cualquier duda.
        </p>
      </div>

      <a
        href="https://mapa-emergencia.artefactofilms.workers.dev/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 px-6 rounded-md transition-colors"
      >
        <ExternalLink className="h-5 w-5" />
        Abrir mapa externo de la comunidad
      </a>

      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
        <Users className="h-4 w-4" />
        <span>
          Vas a salir de RutaDeAyuda y abrir una plataforma comunitaria externa.
        </span>
      </div>
    </div>
  );
}