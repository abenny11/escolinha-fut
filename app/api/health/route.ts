import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export async function GET() {
  const configured = isSupabaseConfigured();
  return NextResponse.json({
    ok: true,
    app: 'Escola de Futebol Grêmio Concórdia',
    backend: configured ? 'supabase' : 'local_fallback',
    supabaseConfigured: configured,
    timestamp: new Date().toISOString(),
  });
}
