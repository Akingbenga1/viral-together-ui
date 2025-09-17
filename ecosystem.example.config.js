module.exports = {
  apps: [
    {
      name: 'viral-together-ui',
      script: 'npm',
       args: 'run dev',
      cwd: '/projects/viral-together-ui', // Update this path to your actual deployment directory
      instances: 1, // Set to 'max' for cluster mode or specific number
      exec_mode: 'fork', // Use 'cluster' for multiple instances
      watch: true, // Set to true for development, false for production
      max_memory_restart: '1G',
      // Logging configuration
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Environment variables (add your specific ones here)
      env_vars: {
        // API Configuration - Update with your production API URL
        NEXT_PUBLIC_API_URL: 'http://localhost:8000',
        
        // Application Configuration
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        
        // Next.js Configuration
        NEXT_TELEMETRY_DISABLED: '1',
      }
    }
  ],
};
