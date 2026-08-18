/**
 * Script to validate environment variables
 * Run: npx tsx scripts/validate-env.ts
 */
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

const optional = [
  'USGS_API_URL',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
];

function validate() {
  console.log('Validating environment variables...\n');

  let hasError = false;

  for (const key of required) {
    const value = process.env[key];
    if (!value) {
      console.error(`❌ ${key} is required but not set`);
      hasError = true;
    } else {
      console.log(`✅ ${key}`);
    }
  }

  console.log('\nOptional variables:');
  for (const key of optional) {
    const value = process.env[key];
    if (value) {
      console.log(`✅ ${key} is set`);
    } else {
      console.log(`⚪ ${key} is not set (optional)`);
    }
  }

  if (hasError) {
    console.error('\n❌ Validation failed! Missing required variables.');
    process.exit(1);
  } else {
    console.log('\n✅ All required variables are set!');
    process.exit(0);
  }
}

validate();
