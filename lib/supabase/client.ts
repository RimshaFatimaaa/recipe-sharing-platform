import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        if (typeof document === 'undefined') return undefined;
        const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : undefined;
      },
      set(name: string, value: string, options?: any) {
        if (typeof document === 'undefined') return;
        const opts = options || {};
        const parts = [
          `${name}=${encodeURIComponent(value)}`,
          `path=${opts.path ?? '/'}`,
          `max-age=${opts.maxAge ?? 60 * 60 * 24 * 365}`,
          `samesite=${opts.sameSite ?? 'lax'}`,
        ];
        if (opts.domain) parts.push(`domain=${opts.domain}`);
        if (opts.secure ?? true) parts.push('secure');
        document.cookie = parts.join('; ');
      },
      remove(name: string, options?: any) {
        if (typeof document === 'undefined') return;
        const opts = options || {};
        const parts = [
          `${name}=`,
          `path=${opts.path ?? '/'}`,
          'max-age=0',
          `samesite=${opts.sameSite ?? 'lax'}`,
        ];
        if (opts.domain) parts.push(`domain=${opts.domain}`);
        if (opts.secure ?? true) parts.push('secure');
        document.cookie = parts.join('; ');
      },
    },
  });
}


