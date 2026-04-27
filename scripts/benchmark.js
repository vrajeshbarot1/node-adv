const autocannon = require('autocannon');

async function runBenchmark() {
  console.log('🚀 Starting Benchmark...');

  const result = await autocannon({
    url: 'http://localhost:3000/v1/auth/login',
    method: 'POST',
    connections: 10,
    duration: 10,
    body: JSON.stringify({
      email: 'admin@taskapp.com',
      password: 'password123'
    }),
    headers: {
      'content-type': 'application/json'
    }
  });

  console.log('📊 Benchmark Result:');
  console.log(`- Req/Sec: ${result.requests.average}`);
  console.log(`- Throughput: ${result.throughput.average} bytes/sec`);
  console.log(`- Latency (avg): ${result.latency.average} ms`);
}

runBenchmark();
