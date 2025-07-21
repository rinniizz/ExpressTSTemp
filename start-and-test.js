// Simple server startup test
const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Starting server test...\n');

// Start the server
const serverProcess = spawn('node', ['dist/server.js'], {
  cwd: process.cwd(),
  stdio: 'pipe'
});

let serverOutput = '';
let serverErrorOutput = '';

serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  serverOutput += output;
  console.log('SERVER OUTPUT:', output);
});

serverProcess.stderr.on('data', (data) => {
  const output = data.toString();
  serverErrorOutput += output;
  console.log('SERVER ERROR:', output);
});

serverProcess.on('close', (code) => {
  console.log(`\n📊 Server process exited with code ${code}`);
  if (code !== 0) {
    console.log('❌ Server failed to start');
    console.log('Error output:', serverErrorOutput);
  }
});

// Wait a bit then test the API
setTimeout(async () => {
  console.log('\n🧪 Testing API after 3 seconds...');
  
  // Test root endpoint
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Response:', data);
      console.log('\n✅ Server is responding!');
      
      // Stop the server
      serverProcess.kill('SIGTERM');
      process.exit(0);
    });
  });

  req.on('error', (err) => {
    console.error('❌ Request failed:', err.message);
    if (err.code === 'ECONNREFUSED') {
      console.log('💡 Server might not be ready yet or failed to start');
    }
    
    // Stop the server
    serverProcess.kill('SIGTERM');
    process.exit(1);
  });

  req.end();
}, 3000);

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n🛑 Terminating server...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Terminating server...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});
