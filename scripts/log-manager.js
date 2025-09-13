#!/usr/bin/env node

/**
 * Log Manager Utility for Viral Together UI
 * This script helps manage application logs
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'app.log');
const MAX_LOG_SIZE = 10 * 1024 * 1024; // 10MB

function readLogs() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      return fs.readFileSync(LOG_FILE, 'utf8');
    }
    return '';
  } catch (error) {
    console.error('Error reading log file:', error);
    return '';
  }
}

function writeLogs(content) {
  try {
    fs.writeFileSync(LOG_FILE, content, 'utf8');
    console.log('Logs written successfully');
  } catch (error) {
    console.error('Error writing log file:', error);
  }
}

function clearLogs() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      fs.unlinkSync(LOG_FILE);
    }
    console.log('Logs cleared successfully');
  } catch (error) {
    console.error('Error clearing logs:', error);
  }
}

function rotateLogs() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const stats = fs.statSync(LOG_FILE);
      if (stats.size > MAX_LOG_SIZE) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedFile = path.join(__dirname, '..', `app-${timestamp}.log`);
        fs.renameSync(LOG_FILE, rotatedFile);
        console.log(`Logs rotated to: ${rotatedFile}`);
      }
    }
  } catch (error) {
    console.error('Error rotating logs:', error);
  }
}

function showLogStats() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const stats = fs.statSync(LOG_FILE);
      const content = fs.readFileSync(LOG_FILE, 'utf8');
      const lines = content.split('\n').filter(line => line.trim()).length;
      
      console.log('Log Statistics:');
      console.log(`- File size: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`- Number of lines: ${lines}`);
      console.log(`- Last modified: ${stats.mtime}`);
      console.log('- Logs are streamed directly to this file in real-time');
    } else {
      console.log('No log file found. Logs will be created when the application starts.');
    }
  } catch (error) {
    console.error('Error getting log stats:', error);
  }
}

function watchLogs() {
  try {
    console.log('Watching log file for new entries... (Press Ctrl+C to stop)');
    console.log('Logs are streamed directly to app.log file in real-time');
    
    if (!fs.existsSync(LOG_FILE)) {
      console.log('Log file does not exist yet. Waiting for logs...');
    }
    
    let lastSize = 0;
    if (fs.existsSync(LOG_FILE)) {
      lastSize = fs.statSync(LOG_FILE).size;
    }
    
    fs.watchFile(LOG_FILE, { interval: 1000 }, (curr, prev) => {
      if (curr.size > lastSize) {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const newContent = content.slice(lastSize);
        console.log('\n=== NEW LOG ENTRIES ===');
        console.log(newContent);
        console.log('=== END OF NEW ENTRIES ===');
        lastSize = curr.size;
      }
    });
  } catch (error) {
    console.error('Error watching log file:', error);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'read':
    console.log(readLogs());
    break;
  case 'clear':
    clearLogs();
    break;
  case 'rotate':
    rotateLogs();
    break;
  case 'stats':
    showLogStats();
    break;
  case 'watch':
    watchLogs();
    break;
  case 'help':
  default:
    console.log(`
Viral Together UI Log Manager

Usage: node scripts/log-manager.js <command>

Commands:
  read    - Read and display all logs
  clear   - Clear all logs
  rotate  - Rotate logs if file is too large
  stats   - Show log file statistics
  watch   - Watch log file for new entries in real-time
  help    - Show this help message

Examples:
  node scripts/log-manager.js read
  node scripts/log-manager.js clear
  node scripts/log-manager.js stats
  node scripts/log-manager.js watch
    `);
    break;
}
