import { Suspense } from 'react';
import { MarcarEncontradoForm } from './marcar-encontrado-form';

export default function MarcarEncontradoPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 max-w-md">Cargando...</div>}>
      <MarcarEncontradoForm />
    </Suspense>
  );
}
