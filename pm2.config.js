module.exports = {
    apps: [
        {
            name: "media-server",
            script: "./dist/server.js",
            instances: 4,
            exec_mode: "cluster",
            watch: false, // Set to true in dev mode if needed
            autorestart: true,
            max_memory_restart: "500M",
            env: {
                NODE_ENV: "production",
                PORT: 3200,
            },
        },
        {
            name: "media-worker",
            script: "dist/services/workerService.js",
            instances: 2,
            exec_mode: "fork",
            watch: false,
            autorestart: true,
            max_memory_restart: "500M",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
};
