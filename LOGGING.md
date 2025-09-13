# UI Logging System

This document describes the logging system implemented in the Viral Together UI application.

## Overview

The UI logging system captures and streams directly to `app.log` file:
- API requests, responses, and errors
- Console logs (log, warn, error, info, debug)
- Application errors and unhandled promise rejections
- User interactions and admin operations
- Performance metrics (request duration)

**Real-time Streaming**: All logs are written directly to the `app.log` file in the UI repository root directory as they occur, eliminating the need for manual downloads.

## Features

### 🔍 **Comprehensive Logging**
- **API Calls**: All HTTP requests/responses with timing
- **Console Output**: All console.log, console.error, etc.
- **Error Tracking**: Global error handlers and unhandled rejections
- **User Actions**: Admin operations, modal interactions
- **Performance**: Request duration and timing metrics

### 🔒 **Security**
- **Sensitive Data Redaction**: Passwords, tokens, and secrets are automatically redacted
- **Direct File Writing**: Logs written directly to local `app.log` file
- **No External Transmission**: Logs never sent to external servers

### 📊 **Log Categories**
- `API`: HTTP requests and responses
- `CONSOLE`: Console output
- `ERROR`: Application errors
- `GENERAL`: General application events

### 📈 **Log Levels**
- `INFO`: General information
- `WARN`: Warning messages
- `ERROR`: Error conditions
- `DEBUG`: Debug information

## Usage

### Browser Console Commands

```javascript
// View logs info (logs are streamed to file)
window.getLogs()

// Clear logs info (use log manager script)
window.clearLogs()

// Access logger directly
window.uiLogger.logInfo('Custom message', { data: 'example' })
```

### Log Management Commands

```bash
# View all logs
node scripts/log-manager.js read

# Watch logs in real-time
node scripts/log-manager.js watch

# Clear all logs
node scripts/log-manager.js clear

# Show log statistics
node scripts/log-manager.js stats

# Rotate logs if file is too large
node scripts/log-manager.js rotate
```

### Log Format

```
TIMESTAMP - LEVEL - CATEGORY - MESSAGE | METHOD URL | Status: CODE | Duration: MS | Data: JSON
```

Example:
```
2024-01-15T10:30:45.123Z - INFO - API - API Response: POST /admin/users/1/profile_update - 200 | POST /admin/users/1/profile_update | Status: 200 | Duration: 245ms | Data: {"message": "Profile updated successfully"}
```

## Admin Dashboard Logging

The admin dashboard includes specific logging for:

### 🔐 **Authentication & Authorization**
- Admin access attempts
- Permission checks
- Role-based access control

### 👥 **User Management**
- User data fetching
- Role assignments and removals
- Profile updates (including password changes)
- Modal interactions

### 📊 **API Operations**
- All admin API calls with full request/response logging
- Error handling and retry attempts
- Performance metrics for each operation

### 🎯 **User Interactions**
- Modal open/close events
- Form submissions
- Button clicks
- Navigation events

## Log Management

### Automatic Features
- **Real-time Streaming**: Logs written directly to `app.log` file as they occur
- **Queue Management**: Prevents memory issues with large log volumes
- **Background Processing**: Logs processed every 2 seconds
- **Error Recovery**: Failed log writes are handled gracefully

### Manual Management
```bash
# Using the log manager script
node scripts/log-manager.js read     # View logs
node scripts/log-manager.js clear    # Clear logs
node scripts/log-manager.js rotate   # Rotate large logs
node scripts/log-manager.js stats    # Show log statistics
```

## Configuration

### Log Levels
The system automatically logs at appropriate levels:
- API requests/responses: `INFO`
- API errors: `ERROR`
- Console output: Matches original level
- User actions: `INFO`
- Validation failures: `WARN`

### Storage Limits
- **Queue Size**: Maximum 100 log entries in memory
- **File Size**: Automatic rotation when `app.log` exceeds 10MB
- **Real-time Writing**: Logs written immediately to file

## Security Considerations

### Data Protection
- Passwords and tokens are automatically redacted
- Sensitive fields are replaced with `[REDACTED]`
- No sensitive data is stored in logs

### Privacy
- Logs are stored locally in the `app.log` file
- No data is transmitted to external servers
- Users can clear logs at any time using the log manager script

## Troubleshooting

### Common Issues

1. **Logs not appearing**
   - Check browser console for errors
   - Verify the `/api/log` endpoint is working
   - Ensure logging is initialized
   - Check if `app.log` file exists in UI root directory

2. **Large log files**
   - Use `node scripts/log-manager.js clear` to clear
   - Check for infinite loops or excessive API calls
   - Use `node scripts/log-manager.js rotate` for large files

3. **Performance issues**
   - Logs are processed in background
   - Large log volumes may impact performance
   - Consider clearing logs regularly

### Debug Commands

```javascript
// Check if logging is working
console.log('Test message')  // Should appear in app.log file

// Check if API endpoint is working
fetch('/api/log', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    category: 'GENERAL',
    message: 'Test log entry'
  })
})
```

## Integration

The logging system is automatically initialized when the application starts. No additional configuration is required.

### Files Modified
- `src/lib/logger.ts` - Core logging functionality with file streaming
- `src/lib/logging-init.ts` - Initialization and setup
- `src/components/LoggingProvider.tsx` - React component wrapper
- `src/lib/api.ts` - API request/response logging
- `src/app/layout.tsx` - Application-wide initialization
- `src/app/dashboard/admin/page.tsx` - Admin-specific logging
- `src/app/api/log/route.ts` - API endpoint for writing logs to file
- `scripts/log-manager.js` - Log management utility
- `app.log` - Log file (created automatically)

### Dependencies
- No external dependencies required
- Uses browser APIs (fetch, console)
- Compatible with all modern browsers
- Next.js API routes for server-side file writing
