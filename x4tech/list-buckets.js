import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const storage = admin.storage();

// List all buckets
console.log('Listing all buckets in project:', serviceAccount.project_id);
console.log('---');

storage.bucket().parent.list()
  .then(([buckets]) => {
    if (buckets.length === 0) {
      console.log('No buckets found in this project!');
      console.log('You may need to create a Cloud Storage bucket first.');
      console.log('Go to: https://console.firebase.google.com → x4tech-24 → Storage');
    } else {
      console.log('Found buckets:');
      buckets.forEach(bucket => {
        console.log('  -', bucket.name);
      });
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error listing buckets:', err.message);
    process.exit(1);
  });
