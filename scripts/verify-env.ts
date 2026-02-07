/**
 * verify-env.ts - Safe environment variable verification for 84tea
 *
 * Checks required keys exist without logging actual values.
 * Run: npx ts-node --esm scripts/verify-env.ts
 * Or:  npm run verify-env
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Environment variable registry - derived from grep of process.env in src/
// ---------------------------------------------------------------------------

interface EnvVarSpec {
  key: string;
  required: boolean;
  scope: 'public' | 'server';
  description: string;
}

const ENV_VARS: EnvVarSpec[] = [
  // Supabase (core)
  { key: 'NEXT_PUBLIC_SUPABASE_URL',      required: true,  scope: 'public', description: 'Supabase project URL' },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true,  scope: 'public', description: 'Supabase anonymous key' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY',     required: true,  scope: 'server', description: 'Supabase service role key (server-only)' },

  // PayOS payment gateway
  { key: 'PAYOS_CLIENT_ID',    required: true,  scope: 'server', description: 'PayOS client ID' },
  { key: 'PAYOS_API_KEY',      required: true,  scope: 'server', description: 'PayOS API key' },
  { key: 'PAYOS_CHECKSUM_KEY', required: true,  scope: 'server', description: 'PayOS checksum key' },

  // SEO & social
  { key: 'NEXT_PUBLIC_SITE_URL',                 required: false, scope: 'public', description: 'Canonical site URL (default: https://84tea.com)' },
  { key: 'NEXT_PUBLIC_FACEBOOK_APP_ID',          required: false, scope: 'public', description: 'Facebook App ID for OG tags' },
  { key: 'NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION', required: false, scope: 'public', description: 'Google Search Console verification' },

  // Hub integration (optional)
  { key: 'NEXT_PUBLIC_HUB_API_URL',   required: false, scope: 'public', description: 'Hub API URL' },
  { key: 'NEXT_PUBLIC_HUB_CLIENT_ID', required: false, scope: 'public', description: 'Hub client ID' },
];

// ---------------------------------------------------------------------------
// Verification logic
// ---------------------------------------------------------------------------

function loadEnvFile(filePath: string): Map<string, string> {
  const entries = new Map<string, string>();
  try {
    if (!fs.existsSync(filePath)) return entries;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      entries.set(key, value);
    }
  } catch {
    // silently ignore read errors
  }
  return entries;
}

function maskValue(value: string): string {
  if (!value) return '(empty)';
  if (value.length <= 8) return '****';
  return value.slice(0, 4) + '****' + value.slice(-4);
}

function verify(): void {
  console.log('=== 84tea Environment Verification ===\n');

  const envPath = path.resolve(__dirname, '../.env.local');
  const envMap = loadEnvFile(envPath);
  const fileExists = fs.existsSync(envPath);

  if (!fileExists) {
    console.warn('WARNING: .env.local not found. Checking process.env only.\n');
  }

  const missing: EnvVarSpec[] = [];
  const empty: EnvVarSpec[] = [];
  const present: EnvVarSpec[] = [];

  for (const spec of ENV_VARS) {
    const fileValue = envMap.get(spec.key) ?? '';
    const envValue = process.env[spec.key] ?? '';
    const resolvedValue = fileValue || envValue;

    if (!resolvedValue) {
      if (spec.required) {
        missing.push(spec);
      } else {
        empty.push(spec);
      }
    } else {
      present.push(spec);
    }
  }

  // Present
  if (present.length > 0) {
    console.log(`OK (${present.length}):`);
    for (const s of present) {
      const val = envMap.get(s.key) || process.env[s.key] || '';
      console.log(`  [+] ${s.key} = ${maskValue(val)}`);
    }
    console.log();
  }

  // Optional missing
  if (empty.length > 0) {
    console.log(`OPTIONAL (${empty.length} not set):`);
    for (const s of empty) {
      console.log(`  [~] ${s.key} - ${s.description}`);
    }
    console.log();
  }

  // Required missing
  if (missing.length > 0) {
    console.error(`MISSING (${missing.length} required):`);
    for (const s of missing) {
      console.error(`  [!] ${s.key} - ${s.description} [${s.scope}]`);
    }
    console.error('\nSet these in .env.local before deploying to production.');
    process.exit(1);
  }

  console.log('Verification complete. All required variables present.');
}

verify();
