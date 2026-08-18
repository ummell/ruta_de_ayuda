export type ResultadoVerificacion = 'verificado' | 'no_encontrado' | 'conflicto';

export interface Verificacion {
  id: string;
  texto_buscar: string;
  resultado: ResultadoVerificacion;
  fuentes: string[];
  detalle: string | null;
  created_at: string;
}

export interface VerificacionFormData {
  texto: string;
}
