import app from './app';
import config from './config/config';

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});

//"start": "node dist/server.js",
// "worker": "node dist/worker.js",