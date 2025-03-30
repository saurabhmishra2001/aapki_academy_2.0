import { createClient } from '@supabase/supabase-js';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read service account
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'serviceAccountKey.json'), 'utf8')
);

console.log('Service Account Project ID:', serviceAccount.project_id);
console.log('Firebase Storage Bucket:', process.env.VITE_FIREBASE_STORAGE_BUCKET);

// Initialize Firebase Admin
try {
  const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = getFirestore();
const storage = getStorage().bucket();

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Helper function to log progress
const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(path.join(__dirname, 'migration.log'), logMessage + '\n');
};

// Helper function to handle errors
const handleError = (error, context) => {
  const errorMessage = `Error in ${context}: ${error.message}\nStack: ${error.stack}`;
  console.error(errorMessage);
  fs.appendFileSync(path.join(__dirname, 'error.log'), errorMessage + '\n');
};

// Helper function to upload file to Firebase Storage
async function uploadFile(fileData, filePath) {
  const file = storage.file(filePath);
  await file.save(fileData);
  return file.publicUrl();
}

// Migrate users
async function migrateUsers() {
  try {
    log('Starting users migration...');
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;

    const batch = db.batch();
    
    for (const user of users) {
      const userRef = db.collection('users').doc(user.id);
      batch.set(userRef, {
        ...user,
        created_at: new Date(user.created_at),
        updated_at: user.updated_at ? new Date(user.updated_at) : null
      });
      log(`Added user to batch: ${user.id}`);
    }

    await batch.commit();
    log(`Completed migrating ${users.length} users`);
  } catch (error) {
    handleError(error, 'migrateUsers');
  }
}

// Migrate courses
async function migrateCourses() {
  try {
    log('Starting courses migration...');
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*');
    
    if (error) throw error;

    const batch = db.batch();

    for (const course of courses) {
      const courseRef = db.collection('courses').doc(course.id);
      batch.set(courseRef, {
        ...course,
        created_at: new Date(course.created_at),
        updated_at: course.updated_at ? new Date(course.updated_at) : null
      });
      log(`Added course to batch: ${course.id}`);
    }

    await batch.commit();
    log(`Completed migrating ${courses.length} courses`);
  } catch (error) {
    handleError(error, 'migrateCourses');
  }
}

// Migrate documents with files
async function migrateDocuments() {
  try {
    log('Starting documents migration...');
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*');
    
    if (error) throw error;

    const batch = db.batch();

    for (const document of documents) {
      if (document.file_path) {
        try {
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('documents')
            .download(document.file_path);
          
          if (downloadError) throw downloadError;

          const fileUrl = await uploadFile(fileData, `documents/${document.file_path}`);
          
          const docRef = db.collection('documents').doc(document.id);
          batch.set(docRef, {
            ...document,
            created_at: new Date(document.created_at),
            updated_at: document.updated_at ? new Date(document.updated_at) : null,
            fileUrl
          });
          log(`Added document with file to batch: ${document.id}`);
        } catch (fileError) {
          handleError(fileError, `processing document ${document.id}`);
        }
      } else {
        const docRef = db.collection('documents').doc(document.id);
        batch.set(docRef, {
          ...document,
          created_at: new Date(document.created_at),
          updated_at: document.updated_at ? new Date(document.updated_at) : null
        });
        log(`Added document without file to batch: ${document.id}`);
      }
    }

    await batch.commit();
    log(`Completed migrating ${documents.length} documents`);
  } catch (error) {
    handleError(error, 'migrateDocuments');
  }
}

// Migrate tests and questions
async function migrateTests() {
  try {
    log('Starting tests migration...');
    const { data: tests, error } = await supabase
      .from('tests')
      .select('*');
    
    if (error) throw error;

    const batch = db.batch();

    for (const test of tests) {
      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('test_id', test.id);

      const testRef = db.collection('tests').doc(test.id);
      batch.set(testRef, {
        ...test,
        created_at: new Date(test.created_at),
        updated_at: test.updated_at ? new Date(test.updated_at) : null,
        questionCount: questions?.length || 0
      });

      if (questions && questions.length > 0) {
        const questionsBatch = db.batch();
        for (const question of questions) {
          const questionRef = testRef.collection('questions').doc(question.id);
          questionsBatch.set(questionRef, {
            ...question,
            created_at: new Date(question.created_at)
          });
        }
        await questionsBatch.commit();
        log(`Migrated ${questions.length} questions for test: ${test.id}`);
      }
    }

    await batch.commit();
    log(`Completed migrating ${tests.length} tests`);
  } catch (error) {
    handleError(error, 'migrateTests');
  }
}

// Migrate videos
async function migrateVideos() {
  try {
    log('Starting videos migration...');
    const { data: videos, error } = await supabase
      .from('videos')
      .select('*');
    
    if (error) throw error;

    const batch = db.batch();

    for (const video of videos) {
      if (video.video_url) {
        const videoRef = db.collection('videos').doc(video.id);
        batch.set(videoRef, {
          ...video,
          created_at: new Date(video.created_at),
          updated_at: video.updated_at ? new Date(video.updated_at) : null
        });
        log(`Added video to batch: ${video.id}`);
      }
    }

    await batch.commit();
    log(`Completed migrating ${videos.length} videos`);
  } catch (error) {
    handleError(error, 'migrateVideos');
  }
}

// Main migration function
async function main() {
  log('Starting migration process...');
  
  try {
    // Test Firebase connection
    try {
      console.log('Testing Firestore connection...');
      const testDoc = db.collection('test_collection').doc('test_document');
      await testDoc.set({
        test: true,
        timestamp: new Date()
      });
      console.log('Successfully wrote to Firestore');
      
      const docData = await testDoc.get();
      console.log('Successfully read from Firestore:', docData.data());
      
      await testDoc.delete();
      console.log('Successfully deleted test document');
      
      log('Firebase connection test successful');
    } catch (error) {
      console.error('Detailed Firebase error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: error.stack
      });
      throw new Error(`Firebase connection failed: ${error.message}`);
    }

    // Test Supabase connection
    try {
      console.log('Testing Supabase connection...');
      const { data, error } = await supabase.from('users').select('count');
      if (error) throw error;
      console.log('Supabase data:', data);
      log('Supabase connection test successful');
    } catch (error) {
      console.error('Detailed Supabase error:', error);
      throw new Error(`Supabase connection failed: ${error.message}`);
    }

    // Migration order is important due to data relationships
    await migrateUsers();
    await migrateCourses();
    await migrateDocuments();
    await migrateTests();
    
    log('Migration completed successfully!');
  } catch (error) {
    handleError(error, 'main migration');
    process.exit(1);
  }
}

// Run the migration
main();
