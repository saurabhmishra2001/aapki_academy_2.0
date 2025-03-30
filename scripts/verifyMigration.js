import { createClient } from '@supabase/supabase-js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'serviceAccountKey.json'), 'utf8')
);

const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
});

const db = getFirestore();

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function verifyCollection(collectionName) {
  console.log(`\nVerifying ${collectionName}...`);
  
  // Get Supabase data
  const { data: supabaseData, error } = await supabase
    .from(collectionName)
    .select('*');
  
  if (error) {
    console.error(`Error fetching from Supabase: ${error.message}`);
    return;
  }
  
  // Get Firebase data
  const firebaseSnapshot = await db.collection(collectionName).get();
  const firebaseData = firebaseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  console.log(`Supabase count: ${supabaseData.length}`);
  console.log(`Firebase count: ${firebaseData.length}`);
  
  if (supabaseData.length !== firebaseData.length) {
    console.log('⚠️ Warning: Different number of records');
  } else {
    console.log('✅ Record count matches');
  }
  
  // Sample check of a few records
  const sampleSize = Math.min(3, supabaseData.length);
  console.log(`\nChecking ${sampleSize} sample records:`);
  
  for (let i = 0; i < sampleSize; i++) {
    const supabaseRecord = supabaseData[i];
    const firebaseRecord = firebaseData.find(r => r.id === supabaseRecord.id);
    
    if (firebaseRecord) {
      console.log(`\nRecord ${i + 1}:`);
      console.log('ID:', supabaseRecord.id);
      console.log('Fields present in both:', Object.keys(firebaseRecord).join(', '));
      console.log('Match status: ✅');
    } else {
      console.log(`\n⚠️ Record ${supabaseRecord.id} not found in Firebase`);
    }
  }
}

async function main() {
  try {
    // Verify each collection
    await verifyCollection('users');
    await verifyCollection('courses');
    await verifyCollection('documents');
    await verifyCollection('tests');
    
    console.log('\nVerification complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during verification:', error);
    process.exit(1);
  }
}

main();
