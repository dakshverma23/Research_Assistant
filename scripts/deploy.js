#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting deployment build...');

try {
  // Build shared package first
  console.log('📦 Building shared package...');
  execSync('npm run build --workspace=shared', { stdio: 'inherit' });
  
  // Verify shared build
  const sharedDistPath = path.join(__dirname, '../shared/dist');
  if (!fs.existsSync(sharedDistPath)) {
    throw new Error('Shared package build failed - dist directory not found');
  }
  console.log('✅ Shared package built successfully');
  
  // Ensure client node_modules exists
  const clientNodeModules = path.join(__dirname, '../client/node_modules');
  if (!fs.existsSync(clientNodeModules)) {
    console.log('📁 Creating client node_modules directory...');
    fs.mkdirSync(clientNodeModules, { recursive: true });
  }
  
  // Copy entire shared package to client node_modules
  console.log('🔗 Copying shared package to client node_modules...');
  const sharedLinkPath = path.join(clientNodeModules, 'shared');
  
  if (fs.existsSync(sharedLinkPath)) {
    fs.rmSync(sharedLinkPath, { recursive: true, force: true });
  }
  
  const sharedSrcPath = path.join(__dirname, '../shared');
  fs.cpSync(sharedSrcPath, sharedLinkPath, { 
    recursive: true,
    filter: (src) => {
      // Don't copy node_modules from shared
      return !src.includes('node_modules');
    }
  });
  console.log('✅ Shared package copied to client node_modules');
  
  // Also copy to server node_modules for consistency
  console.log('🔗 Copying shared package to server node_modules...');
  const serverNodeModules = path.join(__dirname, '../server/node_modules');
  if (!fs.existsSync(serverNodeModules)) {
    fs.mkdirSync(serverNodeModules, { recursive: true });
  }
  
  const serverSharedLinkPath = path.join(serverNodeModules, 'shared');
  if (fs.existsSync(serverSharedLinkPath)) {
    fs.rmSync(serverSharedLinkPath, { recursive: true, force: true });
  }
  
  fs.cpSync(sharedSrcPath, serverSharedLinkPath, { 
    recursive: true,
    filter: (src) => {
      return !src.includes('node_modules');
    }
  });
  console.log('✅ Shared package copied to server node_modules');
  
  // Build client
  console.log('🎨 Building client...');
  execSync('npm run build --workspace=client', { stdio: 'inherit' });
  
  // Verify client build
  const clientDistPath = path.join(__dirname, '../client/dist');
  if (!fs.existsSync(clientDistPath)) {
    throw new Error('Client build failed - dist directory not found');
  }
  console.log('✅ Client built successfully');
  
  // Build server
  console.log('⚙️  Building server...');
  execSync('npm run build --workspace=server', { stdio: 'inherit' });
  
  // Verify server build
  const serverDistPath = path.join(__dirname, '../server/dist');
  if (!fs.existsSync(serverDistPath)) {
    throw new Error('Server build failed - dist directory not found');
  }
  console.log('✅ Server built successfully');
  
  console.log('🎉 Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}