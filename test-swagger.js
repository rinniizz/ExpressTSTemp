const { spawn } = require('child_process');
const http = require('http');

let serverProcess = null;

// Function to test an endpoint
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

// Function to wait for server to be ready
function waitForServer(maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkServer = () => {
      attempts++;
      console.log(`⏳ Checking if server is ready (attempt ${attempts}/${maxAttempts})...`);
      
      testEndpoint('/')
        .then(() => {
          console.log('✅ Server is ready!');
          resolve();
        })
        .catch((error) => {
          if (attempts >= maxAttempts) {
            reject(new Error(`Server not ready after ${maxAttempts} attempts: ${error.message}`));
          } else {
            setTimeout(checkServer, 1000); // Wait 1 second before next attempt
          }
        });
    };
    
    checkServer();
  });
}

// Function to run all API tests including Swagger
async function runAPITests() {
  console.log('\n🧪 Running comprehensive API tests with Swagger...\n');

  const tests = [
    {
      name: 'Root endpoint',
      path: '/',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Health endpoint',
      path: '/api/v1/health',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Swagger UI (/api-docs)',
      path: '/api-docs/',
      method: 'GET',
      expectedStatus: 200,
      isHTML: true
    },
    {
      name: 'Swagger JSON spec (/api-docs.json)',
      path: '/api-docs.json',
      method: 'GET',
      expectedStatus: 200
    },
    {
      name: 'Docs redirect (/docs)',
      path: '/docs',
      method: 'GET',
      expectedStatus: [301, 302], // Redirect status codes
      isRedirect: true
    },
    {
      name: 'Users endpoint (should require auth)',
      path: '/api/v1/users',
      method: 'GET',
      expectedStatus: 401
    },
    {
      name: 'Auth register endpoint',
      path: '/api/v1/auth/register',
      method: 'POST',
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpass123'
      },
      expectedStatus: [201, 400] // 201 for success, 400 for validation errors
    },
    {
      name: 'Non-existent endpoint (404 test)',
      path: '/api/v1/nonexistent',
      method: 'GET',
      expectedStatus: 404
    }
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`🔍 Testing: ${test.name}`);
      console.log(`   ${test.method} ${test.path}`);
      
      const result = await testEndpoint(test.path, test.method, test.data);
      
      const isExpectedStatus = Array.isArray(test.expectedStatus) 
        ? test.expectedStatus.includes(result.status)
        : result.status === test.expectedStatus;
      
      const status = isExpectedStatus ? '✅' : '❌';
      
      console.log(`   ${status} Status: ${result.status} ${isExpectedStatus ? '(Expected)' : '(Unexpected)'}`);
      
      if (test.isHTML) {
        const isSwaggerUI = typeof result.data === 'string' && result.data.includes('swagger-ui');
        console.log(`   ${isSwaggerUI ? '✅' : '❌'} Contains Swagger UI: ${isSwaggerUI}`);
        console.log(`   Response: HTML content (${result.data.length} chars)`);
      } else if (test.isRedirect) {
        console.log(`   Response: Redirect to /api-docs`);
      } else {
        console.log(`   Response:`, JSON.stringify(result.data, null, 4));
      }
      console.log('');
      
      results.push({
        test: test.name,
        status: result.status,
        success: isExpectedStatus,
        response: test.isHTML ? 'HTML_CONTENT' : result.data
      });
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
      results.push({
        test: test.name,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    }
  }

  // Summary
  console.log('📊 Test Results Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.test}: ${result.status}`);
  });
  
  console.log(`\n🎯 Success Rate: ${successful}/${total} (${Math.round(successful/total*100)}%)`);
  console.log('\n📚 Swagger Documentation:');
  console.log('   🌐 Swagger UI: http://localhost:3000/api-docs');
  console.log('   📄 JSON Spec: http://localhost:3000/api-docs.json');
  console.log('   🔗 Quick Link: http://localhost:3000/docs (redirects to Swagger UI)');
  
  return results;
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting Express TypeScript Template API Test Suite with Swagger\n');

    // Start the server
    console.log('📡 Starting server...');
    serverProcess = spawn('node', ['dist/server.js'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    // Log server output
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        console.log('SERVER:', output);
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('Ignoring invalid configuration')) {
        console.log('SERVER ERROR:', output);
      }
    });

    // Wait for server to be ready
    await waitForServer();

    // Run the tests
    const results = await runAPITests();

    // Keep server running for manual testing
    console.log('\n🔧 Server is still running for manual testing...');
    console.log('   💻 Open http://localhost:3000/api-docs in your browser to view Swagger UI');
    console.log('   🛑 Press Ctrl+C to stop the server and exit');
    
    // Don't auto-stop, let user manually test Swagger UI
    // serverProcess.kill('SIGTERM');
    // process.exit(0);

  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
    
    process.exit(1);
  }
}

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n🛑 Test suite interrupted - stopping server...');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  process.exit(0);
});

// Run the main function
main();
