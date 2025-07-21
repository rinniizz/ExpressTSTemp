const http = require('http');
const https = require('https');

// Simple HTTP client for testing
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Client'
      }
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonBody
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test function
async function testAPI() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test root endpoint
    console.log('1. Testing root endpoint (/)...');
    const rootResponse = await makeRequest(baseUrl + '/');
    console.log(`Status: ${rootResponse.statusCode}`);
    console.log('Response:', JSON.stringify(rootResponse.data, null, 2));
    console.log('');

    // Test health endpoint
    console.log('2. Testing health endpoint (/api/v1/health)...');
    const healthResponse = await makeRequest(baseUrl + '/api/v1/health');
    console.log(`Status: ${healthResponse.statusCode}`);
    console.log('Response:', JSON.stringify(healthResponse.data, null, 2));
    console.log('');

    // Test auth register endpoint
    console.log('3. Testing auth register endpoint (/api/v1/auth/register)...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123'
    };
    const registerResponse = await makeRequest(baseUrl + '/api/v1/auth/register', 'POST', registerData);
    console.log(`Status: ${registerResponse.statusCode}`);
    console.log('Response:', JSON.stringify(registerResponse.data, null, 2));
    console.log('');

    // Test users endpoint (should require auth)
    console.log('4. Testing users endpoint (/api/v1/users)...');
    const usersResponse = await makeRequest(baseUrl + '/api/v1/users');
    console.log(`Status: ${usersResponse.statusCode}`);
    console.log('Response:', JSON.stringify(usersResponse.data, null, 2));
    console.log('');

    console.log('✅ API testing completed!');

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running first with: npm run dev or node dist/server.js');
    }
  }
}

// Run the test
testAPI();
