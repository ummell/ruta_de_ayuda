import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Supabase client
vi.mock('@/lib/db', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          ilike: vi.fn(() => ({
            order: vi.fn(() => ({
              range: vi.fn(() => ({
                then: vi.fn(),
              })),
            })),
          })),
        })),
      })),
      insert: vi.fn(() => ({
        update: vi.fn(() => ({
          delete: vi.fn(() => ({
            select: vi.fn(() => ({ data: null, error: null })),
          })),
        })),
        select: vi.fn(() => ({ data: null, error: null })),
      })),
    })),
  })),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
}));
