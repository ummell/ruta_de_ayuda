'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function MarcarEncontradoForm() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleConfirm = async () => {
    if (!id || !token) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/personas/marcar-encontrado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'No se pudo actualizar el estado');
      }

      setStatus('success');
      setMessage('Marcado como encontrada. Gracias por actualizar el reporte.');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Marcar persona como encontrada</CardTitle>
          <CardDescription>
            Confirmá esta acción solo si la persona reportada fue encontrada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!id || !token ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Enlace inválido: falta id o token.</AlertDescription>
            </Alert>
          ) : status === 'success' ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : (
            <>
              {status === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <Button onClick={handleConfirm} disabled={status === 'loading'}>
                {status === 'loading' ? 'Confirmando...' : 'Confirmar: encontrada'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
