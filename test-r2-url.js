const https = require('https');

const testUrl = 'https://pub-9f79ad87bb114a39b574c3c106deee69.r2.dev/visuals/1779981058515-eix7cnf04gf.png';

console.log('Fetching:', testUrl);

https.get(testUrl, (res) => {
  console.log('HTTP Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.log('Response body:', data.slice(0, 500));
    } else {
      console.log('✅ Image is accessible! Content length:', res.headers['content-length']);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching URL:', err.message);
});
