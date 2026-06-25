module.exports = {
  apps: [
    {
      name: "gaila",
      cwd: "/home/gaila",
      script: "node_modules/.bin/next",
      args: "start -p 3002 -H 127.0.0.1",
      env: {
        NODE_ENV: "production",
        NEXT_DIST_DIR: ".next-gaila-prod",
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
