"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("./middlewares/errorHandler");
const swagger_1 = require("./swagger");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Routes
app.use('/', routes_1.default);
(0, swagger_1.setupSwagger)(app);
// Global error handler (should be after routes)
app.use(errorHandler_1.errorHandler);
exports.default = app;
