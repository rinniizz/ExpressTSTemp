const http = require('http');

function testEndpoint(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test 1: Root endpoint
    console.log('1. Root endpoint (/)');
    const root = await testEndpoint('/');
    console.log(`   Status: ${root.status}`);
    console.log(`   Response:`, JSON.stringify(root.data, null, 2));
    console.log('');

    // Test 2: Health endpoint
    console.log('2. Health endpoint (/api/v1/health)');
    const health = await testEndpoint('/api/v1/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response:`, JSON.stringify(health.data, null, 2));
    console.log('');

    // Test 3: Users endpoint (protected)
    console.log('3. Users endpoint (/api/v1/users)');
    const users = await testEndpoint('/api/v1/users');
    console.log(`   Status: ${users.status}`);
    console.log(`   Response:`, JSON.stringify(users.data, null, 2));
    console.log('');

    // Test 4: Auth register
    console.log('4. Auth register (/api/v1/auth/register)');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpass123'
    };
    const register = await testEndpoint('/api/v1/auth/register', 'POST', registerData);
    console.log(`   Status: ${register.status}`);
    console.log(`   Response:`, JSON.stringify(register.data, null, 2));
    console.log('');

    console.log('✅ All tests completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTests();
