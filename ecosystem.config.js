module.exports = {
  apps: [{
    name: 'express-typescript-api',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'dist'],
    merge_logs: true,
    kill_timeout: 5000,
    restart_delay: 1000,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
