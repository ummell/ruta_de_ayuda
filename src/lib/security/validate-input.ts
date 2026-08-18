import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Validates and sanitizes user input using Zod schemas
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}

/**
 * Sanitizes HTML content to prevent XSS
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'li', 'ol'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitizes plain text (removes all HTML)
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Validates that a string contains no SQL injection patterns
 */
export function hasSQLInjection(str: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|;|\/\*|\*\/|@@|@)/,
    /('(''|[^'])*')/,
    /(UNION|UNION ALL)/i,
    /\b(OR|AND)\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(str));
}

/**
 * Allowlist validation for search inputs
 */
export function sanitizeSearchInput(input: string): string {
  const sqlKeywords = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION)\b/gi;

  return input
    .replace(/[<>'";]/g, '')
    .replace(/(--|\/\*|\*\/)/g, '')
    .replace(sqlKeywords, '')
    .replace(/(\b(or|and)\b)/gi, '')
    .trim()
    .slice(0, 200);
}
