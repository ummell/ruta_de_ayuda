import { describe, it, expect } from 'vitest';
import { sanitizeHTML, sanitizeText, hasSQLInjection, sanitizeSearchInput } from '@/lib/security/validate-input';

describe('sanitizeHTML', () => {
  it('removes script tags', () => {
    const dirty = '<script>alert("xss")</script>Hello';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('alert');
    expect(clean).toContain('Hello');
  });

  it('removes onclick handlers', () => {
    const dirty = '<img src="x" onload="alert(1)">';
    const clean = sanitizeHTML(dirty);
    expect(clean).not.toContain('onload');
  });

  it('allows safe tags', () => {
    const input = '<p>Hello <strong>World</strong></p>';
    const clean = sanitizeHTML(input);
    expect(clean).toContain('<p>');
    expect(clean).toContain('<strong>');
  });
});

describe('sanitizeText', () => {
  it('removes all HTML tags', () => {
    const dirty = '<p>Hello <script>bad</script></p>';
    const clean = sanitizeText(dirty);
    expect(clean).not.toContain('<');
    expect(clean).not.toContain('bad');
  });
});

describe('hasSQLInjection', () => {
  it('detects SQL keywords', () => {
    expect(hasSQLInjection("'; DROP TABLE users; --")).toBe(true);
    expect(hasSQLInjection('SELECT * FROM users')).toBe(true);
    expect(hasSQLInjection('1 OR 1=1')).toBe(true);
  });

  it('allows normal text', () => {
    expect(hasSQLInjection('Hola María')).toBe(false);
    expect(hasSQLInjection('Calle 5 #12-34')).toBe(false);
  });
});

describe('sanitizeSearchInput', () => {
  it('removes dangerous characters', () => {
    const dirty = "Maria'; DROP--";
    const clean = sanitizeSearchInput(dirty);
    expect(clean).not.toContain("'");
    expect(clean).not.toContain('DROP');
  });

  it('removes OR/AND keywords', () => {
    const dirty = 'Maria OR 1=1';
    const clean = sanitizeSearchInput(dirty);
    expect(clean).not.toContain('OR');
  });

  it('limits length', () => {
    const dirty = 'a'.repeat(300);
    const clean = sanitizeSearchInput(dirty);
    expect(clean.length).toBe(200);
  });
});
