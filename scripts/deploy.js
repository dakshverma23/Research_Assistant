#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting deployment build...');

try {
  // Build shared package
  console.log('📦 Building shared package...');
  execSync('npm run build --workspace=shared', { stdio: 'inherit' });
  
  // Build client
  console.log('🎨 Building client...');
  execSync('npm run build --workspace=client', { stdio: 'inherit' });
  
  // Verify builds
  console.log('✅ Verifying builds...');
  
  const fs = require('fs');
  
  // Check if shared dist exists
  if (!fs.existsSync(path.join(__dirname, '../shared/dist'))) {
    throw new Error('Shared package build failed - dist directory not found');
  }
  
  // Check if client dist exists
  if (!fs.existsSync(path.join(__dirname, '../client/dist'))) {
    throw new Error('Client build failed - dist directory not found');
  }
  
  console.log('🎉 Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}