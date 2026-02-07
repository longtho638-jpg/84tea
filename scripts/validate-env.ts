import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_KEYS = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'PAYOS_CLIENT_ID',
  'PAYOS_API_KEY',
  'PAYOS_CHECKSUM_KEY',
  'NEXT_PUBLIC_FACEBOOK_APP_ID',
  'NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION',
];

function validateEnv() {
  console.log('🔍 Validating Environment Variables...');

  const envPath = path.resolve(__dirname, '../.env.local');
  let envContent = '';

  try {
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    } else {
      console.warn('⚠️ .env.local file not found!');
    }
  } catch (error) {
    console.warn('⚠️ Error reading .env.local');
  }

  const missingKeys: string[] = [];
  const emptyKeys: string[] = [];

  REQUIRED_KEYS.forEach(key => {
    // Check process.env (loaded by Next.js or manually)
    // Note: This script checks static .env file mostly, but for runtime we check process.env
    // Simple regex check on file content for existence
    const match = envContent.match(new RegExp(`^${key}=`, 'm'));
    const valueMatch = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));

    if (!match) {
      missingKeys.push(key);
    } else if (valueMatch && !valueMatch[1].trim()) {
      emptyKeys.push(key);
    }
  });

  if (missingKeys.length > 0) {
    console.error('❌ Missing Keys (not defined):');
    missingKeys.forEach(k => console.error(`   - ${k}`));
  }

  if (emptyKeys.length > 0) {
    console.error('⚠️ Empty Keys (defined but no value):');
    emptyKeys.forEach(k => console.error(`   - ${k}`));
  }

  if (missingKeys.length === 0 && emptyKeys.length === 0) {
    console.log('✅ All required environment variables are defined.');
  } else {
    console.log('\nAction Required: Please populate these variables in .env.local for production.');
    process.exit(1);
  }
}

validateEnv();
