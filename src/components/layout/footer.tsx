import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold">RutaDeAyuda</p>
            <p className="text-xs text-muted-foreground">
              Plataforma de ayuda humanitaria - Equipo Voluntario Ciudadano
            </p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/info" className="hover:underline">
              Info
            </Link>
            <Link href="/responsabilidad" className="hover:underline">
              Responsabilidad
            </Link>
            <Link href="/privacidad" className="hover:underline">
              Privacidad
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Esta plataforma no reemplaza a las autoridades. Verifica siempre la información.
        </div>
      </div>
    </footer>
  );
}
