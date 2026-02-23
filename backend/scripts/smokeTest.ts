
/**
 * Production Smoke Test
 * Verifies critical backend functionality for production readiness.
 */

const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

async function runTests() {
    console.log('🚀 Starting Production Smoke Test...');
    let passed = 0;
    let failed = 0;

    const test = async (name: string, fn: () => Promise<void>) => {
        try {
            await fn();
            console.log(`✅ PASS: ${name}`);
            passed++;
        } catch (error: any) {
            console.error(`❌ FAIL: ${name} -> ${error.message}`);
            failed++;
        }
    };

    // 1. Health Check
    await test('Health Check /api/health', async () => {
        const res = await fetch(`${BACKEND_URL}/api/health`);
        const data = await res.json();
        if (res.status !== 200) throw new Error(`Status ${res.status}`);
        if (data.status !== 'ok') throw new Error('Status not ok');
        if (!data.database || data.database !== 'connected') throw new Error('Database not connected');
    });

    // 2. Google OAuth Redirect
    await test('Google OAuth Redirect', async () => {
        const res = await fetch(`${BACKEND_URL}/api/auth/google`, { redirect: 'manual' });
        // Redirect status is usually 302
        if (res.status !== 302) throw new Error(`Expected 302, got ${res.status}`);
        const location = res.headers.get('location');
        if (!location || !location.includes('accounts.google.com')) {
            throw new Error(`Invalid redirect location: ${location}`);
        }
    });

    // 3. Protected Route (Invalid JWT)
    await test('Protected Route (No JWT)', async () => {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`);
        if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    });

    await test('Protected Route (Invalid JWT)', async () => {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
            headers: { 'Authorization': 'Bearer invalid-token' }
        });
        if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    });

    console.log('\n--- Smoke Test Summary ---');
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    if (failed > 0) {
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Smoke test execution failed:', err);
    process.exit(1);
});
