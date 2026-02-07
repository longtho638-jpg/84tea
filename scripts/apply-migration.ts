import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust .env parsing without 'dotenv' dependency
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim();
          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
      console.log('✅ Loaded .env.local');
    } else {
      console.log('⚠️ .env.local not found, relying on process.env');
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn('⚠️ Could not load .env.local:', msg);
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Missing required environment variables.');
  console.error('   Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false }
});

const SQL_FILE_PATH = path.resolve(__dirname, '../supabase/migrations/20260207_create_products_table.sql');

async function main() {
  console.log('🚀 Applying Database Migrations for 84tea...');
  console.log(`📖 SQL File: ${SQL_FILE_PATH}`);

  try {
    const sqlContent = fs.readFileSync(SQL_FILE_PATH, 'utf8');

    // Split by semicolons to execute statements individually?
    // supabase-js rpc usually takes the whole block if it's a PL/pgSQL function,
    // but for raw SQL via an 'exec_sql' helper, it depends on the helper implementation.
    // If 'exec_sql' doesn't exist, we can try to create it first? No, we need it to create it.

    console.log('⚡ Attempting execution via "exec_sql" RPC...');

    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      console.error('❌ RPC Execution Failed:', error.message);
      console.log('\n--- DIAGNOSIS ---');
      console.log('1. The "exec_sql" RPC function might not exist in your Supabase database.');
      console.log('2. Or the service role key lacks permissions.');
      console.log('\n--- MANUAL FALLBACK ---');
      console.log('Please execute the SQL manually via the Supabase Dashboard SQL Editor.');
      console.log('The SQL content is in:', SQL_FILE_PATH);
    } else {
      console.log('✅ Migration Applied Successfully!');
    }

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('❌ Script Error:', msg);
    process.exit(1);
  }
}

main();
