import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
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
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkHealth() {
  console.log('🏥 Starting Health Check...');

  try {
    // 1. Check Connection & Products Table
    const { error: prodError } = await supabase
      .from('products')
      .select('count')
      .limit(1)
      .single();

    if (prodError && prodError.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows" which is fine for connection check
       throw new Error(`Products table check failed: ${prodError.message}`);
    }
    console.log('✅ Database connection: OK');
    console.log('✅ Products table: Accessible');

    // 2. Check Storage Bucket
    const { data: buckets, error: storageError } = await supabase
      .storage
      .listBuckets();

    if (storageError) {
      console.warn('⚠️ Storage check failed:', storageError.message);
    } else {
      const hasImagesBucket = buckets?.some(b => b.name === 'product-images');
      if (hasImagesBucket) {
        console.log('✅ Storage bucket (product-images): Found');
      } else {
        console.warn('⚠️ Storage bucket (product-images): MISSING');
      }
    }

    // 3. Check RLS Policies (indirectly via public client)
    // We create a public client (anon key) and try to insert. It should fail.
    const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (ANON_KEY) {
      const publicClient = createClient(SUPABASE_URL!, ANON_KEY);
      const { error: rlsError } = await publicClient
        .from('products')
        .insert({ slug: 'test-hack', name: 'Hacked', category: 'tea', price: 0 });

      if (rlsError) {
        console.log('✅ RLS Policy: Active (Public Write Blocked)');
      } else {
        console.error('❌ RLS Policy: INACTIVE (Public Write Allowed!)');
        // Clean up if it actually succeeded
        await supabase.from('products').delete().eq('slug', 'test-hack');
      }
    } else {
      console.warn('⚠️ Skipping RLS check: No ANON key found');
    }

    console.log('\n🎉 Health Check Completed.');

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ Health Check Failed:', msg);
    process.exit(1);
  }
}

checkHealth();
