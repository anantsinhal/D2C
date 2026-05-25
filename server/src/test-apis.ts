import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== [AETHERIS API INTEGRATION VERIFICATION] ===');
  
  try {
    // 1. Health check
    console.log('Testing /api/health ...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthData.status, 'healthy');
    console.log('✓ Health Check passed.');

    console.log('\nSupabase-backed routes require an authenticated session token.');
    console.log('Set SUPABASE_ACCESS_TOKEN in the environment if you want to run the full end-to-end smoke test.');

    console.log('\n=========================================');
    console.log('✓ BASIC BACKEND HEALTH CHECK PASSED');
    console.log('=========================================');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ API Verification Failed:', error);
    process.exit(1);
  }
}

// Introduce slight delay to allow server to bind ports in concurrent task runs
setTimeout(runTests, 2000);
