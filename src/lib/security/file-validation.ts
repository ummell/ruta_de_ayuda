const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates an uploaded image file
 */
export function validateImageFile(file: File): FileValidationResult {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Solo se aceptan: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `El archivo es muy grande. Máximo 5MB.`,
    };
  }

  // Check for empty file
  if (file.size === 0) {
    return {
      valid: false,
      error: 'El archivo está vacío.',
    };
  }

  // Check filename for path traversal attempts
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return {
      valid: false,
      error: 'Nombre de archivo inválido.',
    };
  }

  return { valid: true };
}

/**
 * Extracts metadata from an image file
 */
export async function extractImageMetadata(file: File): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        type: file.type,
        size: file.size,
        name: file.name,
      });
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      resolve({
        type: file.type,
        size: file.size,
        name: file.name,
      });
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}
