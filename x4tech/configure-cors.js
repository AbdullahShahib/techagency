import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Download your service account key from Firebase Console:
// 1. Go to https://console.firebase.google.com
// 2. Select x4tech-24 project
// 3. Click ⚙️ Settings → Service Accounts
// 4. Click "Generate New Private Key"
// 5. Save it as serviceAccountKey.json in this folder

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'x4tech-24.firebasestorage.app'
});

const bucket = admin.storage().bucket();

const corsConfig = [
  {
    origin: [
      'https://agency-six-olive.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000'
    ],
    method: ['GET', 'HEAD', 'DELETE', 'POST', 'PUT', 'OPTIONS'],
    responseHeader: ['Content-Type', 'x-goog-meta-uploaded-content-length'],
    maxAgeSeconds: 3600
  }
];

console.log('Setting CORS for bucket:', bucket.name);

bucket.setCorsConfiguration(corsConfig)
  .then(() => {
    console.log('✓ CORS configured successfully!');
    console.log('Allowed origins:', corsConfig[0].origin);
    process.exit(0);
  })
  .catch((err) => {
    console.error('✗ Error setting CORS:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  });
