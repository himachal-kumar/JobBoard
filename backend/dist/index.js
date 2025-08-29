"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_hepler_1 = require("./app/common/helper/config.hepler");
(0, config_hepler_1.loadConfig)();
const error_handler_middleware_1 = __importDefault(require("./app/common/middleware/error-handler.middleware"));
const database_service_1 = require("./app/common/services/database.service");
const passport_jwt_service_1 = require("./app/common/services/passport-jwt.service");
const routes_1 = __importDefault(require("./app/routes"));
const swagger_config_1 = require("./app/common/config/swagger.config");
// Get port from environment or use default
let port = parseInt(process.env.PORT || '5000', 10);
// Debug port configuration
console.log('Environment PORT:', process.env.PORT);
console.log('Final PORT:', port);
console.log('PORT type:', typeof port);
// Ensure port is valid
if (isNaN(port) || port < 1 || port > 65535) {
    console.error('Invalid port number:', process.env.PORT);
    console.error('Using default port 5000');
    port = 5000;
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    // init mongodb
    yield (0, database_service_1.initDB)();
    // passport init
    (0, passport_jwt_service_1.initPassport)();
    // Swagger documentation
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Job Board API Documentation',
        customfavIcon: '/favicon.ico',
        swaggerOptions: {
            docExpansion: 'list',
            filter: true,
            showRequestHeaders: true,
            tryItOutEnabled: true,
        },
    }));
    // set base path to /api
    app.use("/api", routes_1.default);
    // Health check endpoint for Docker
    app.get("/health", (req, res) => {
        res.status(200).json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        });
    });
    app.get("/", (req, res) => {
        res.send({
            status: "ok",
            message: "Job Board API is running",
            documentation: "/api-docs",
            api: "/api",
            health: "/health"
        });
    });
    // error handler
    app.use(error_handler_middleware_1.default);
    http_1.default.createServer(app).listen(port, () => {
        console.log("Server is running on port", port);
        console.log("API Documentation available at: http://localhost:" + port + "/api-docs");
    });
});
void initApp();
