import { Info } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 text-sm">
      <div className="container mx-auto flex items-start gap-2 text-amber-800">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          <strong>RutaDeAyuda no es fuente oficial.</strong> Los reportes son ciudadanos.
          Antes de actuar, confirma con{' '}
          <a
            href="https://portal.gestiondelriesgo.gov.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-amber-600"
          >
            UNGRD
          </a>{' '}
          ·{' '}
          <a
            href="https://www.defensacivil.gov.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-amber-600"
          >
            Defensa Civil
          </a>{' '}
          ·{' '}
          <a
            href="https://www.cruzrojacolombiana.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-amber-600"
          >
            Cruz Roja
          </a>{' '}
          · línea <strong>123</strong>.
        </p>
      </div>
    </div>
  );
}
