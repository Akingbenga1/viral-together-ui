import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const logData = await request.json();
    
    // Get the log file path in the UI repo root
    const logFilePath = path.join(process.cwd(), 'app.log');
    
    // Format the log entry
    const timestamp = new Date().toISOString();
    let logEntry = `${timestamp} - ${logData.level} - ${logData.category} - ${logData.message}`;
    
    // Add additional data if present
    if (logData.data) {
      logEntry += ` | Data: ${JSON.stringify(logData.data)}`;
    }
    
    // Add method and URL if present (for API logs)
    if (logData.method && logData.url) {
      logEntry += ` | ${logData.method} ${logData.url}`;
    }
    
    // Add status and duration if present
    if (logData.status) {
      logEntry += ` | Status: ${logData.status}`;
    }
    
    if (logData.duration) {
      logEntry += ` | Duration: ${logData.duration}`;
    }
    
    // Append to log file
    fs.appendFileSync(logFilePath, logEntry + '\n');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing to log file:', error);
    return NextResponse.json({ error: 'Failed to write log' }, { status: 500 });
  }
}
