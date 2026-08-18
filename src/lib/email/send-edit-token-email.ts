import { Resend } from 'resend';

function isPlaceholderKey(key: string | undefined): boolean {
  return !key || key.startsWith('your-') || key === 'placeholder';
}

interface SendEditTokenEmailParams {
  to: string;
  personaNombre: string;
  editUrl: string;
}

export async function sendEditTokenEmail({
  to,
  personaNombre,
  editUrl,
}: SendEditTokenEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (isPlaceholderKey(apiKey)) {
    console.warn('[email] RESEND_API_KEY no configurada (placeholder). Email no enviado.');
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || 'RutaDeAyuda <no-reply@rutadeayuda.example>';

  await resend.emails.send({
    from,
    to,
    subject: `Tu reporte de ${personaNombre} — enlace para marcar como encontrada`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reporte creado</h2>
        <p>Registraste un reporte de búsqueda para <strong>${personaNombre}</strong>.</p>
        <p>Cuando la persona sea encontrada, usá este enlace para actualizar el estado:</p>
        <p>
          <a href="${editUrl}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">
            Marcar como encontrada
          </a>
        </p>
        <p style="color:#6b7280;font-size:12px;">
          Si no reconocés este reporte, ignorá este correo. No compartas este enlace —
          cualquiera con él puede actualizar el estado del reporte.
        </p>
      </div>
    `,
  });
}
