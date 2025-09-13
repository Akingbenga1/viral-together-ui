module.exports = {
  apps: [
    {
      name: 'viral-together-ui',
      script: 'npm',
      args: 'run dev',
      cwd: '/projects/viral-together-ui', // Update this path to your actual deployment directory
      instances: 1, // Set to 'max' for cluster mode or specific number
      exec_mode: 'fork', // Use 'cluster' for multiple instances
      watch: false, // Set to true for development, false for production
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
      },
      // Logging configuration
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Advanced options
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Health monitoring
      health_check_grace_period: 3000,
      
      // Auto restart on file changes (set to false for production)
      ignore_watch: [
        'node_modules',
        'logs',
        '.git',
        '.next',
        'build'
      ],
      
      // Environment variables (add your specific ones here)
      env_vars: {
        // API Configuration
        NEXT_PUBLIC_API_URL: 'https://your-api-domain.com',
        
        // Application Configuration
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
        
        // Next.js Configuration
        NEXT_TELEMETRY_DISABLED: '1',
        
        // Optional: Additional Configuration
        // NEXT_PUBLIC_APP_URL: 'https://yourdomain.com',
        // NEXT_PUBLIC_APP_NAME: 'Viral Together',
        // NEXT_PUBLIC_APP_VERSION: '1.0.0',
      }
    }
  ],

  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'ubuntu', // Your server username
      host: ['your-server-ip'], // Your server IP address
      ref: 'origin/main', // Git branch to deploy
      repo: 'https://github.com/your-username/viral-together-ui.git', // Your repository URL
      path: '/var/www/viral-together-ui', // Deployment path on server
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
