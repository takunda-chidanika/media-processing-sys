import express from 'express';
import {errorHandler} from './middlewares/errorHandler';
import {setupSwagger} from "./swagger";
import routes from "./routes";

const app = express();

app.use(express.json());

// Routes
app.use('/', routes);

setupSwagger(app);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;