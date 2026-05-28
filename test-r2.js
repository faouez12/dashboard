const { S3Client, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Manually load env from .env.local
try {
  const envPath = path.join(process.cwd(), '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const cleanLine = line.trim();
    if (cleanLine && !cleanLine.startsWith('#')) {
      const match = cleanLine.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        // Remove surrounding quotes if any
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  });
} catch (e) {
  console.warn('Could not manually parse .env.local:', e.message);
}

async function testR2() {
  console.log('R2_ACCESS_KEY_ID:', process.env.R2_ACCESS_KEY_ID);
  console.log('R2_ENDPOINT:', process.env.R2_ENDPOINT);
  console.log('R2_BUCKET_NAME:', process.env.R2_BUCKET_NAME);
  console.log('R2_PUBLIC_URL:', process.env.R2_PUBLIC_URL);

  const client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  try {
    console.log('Testing listing objects in bucket...');
    const listRes = await client.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        MaxKeys: 5,
      })
    );
    console.log('✅ List success! Objects count/keys:', listRes.Contents?.map(c => c.Key) || 'empty bucket');

    console.log('Testing putting a test object...');
    const putRes = await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: 'test-upload-from-script.txt',
        Body: 'Hello Cloudflare R2 from Shahine Dashboard builder!',
        ContentType: 'text/plain',
      })
    );
    console.log('✅ Put success! Response:', putRes);
  } catch (err) {
    console.error('❌ R2 connection test failed:', err);
  }
}

testR2();
