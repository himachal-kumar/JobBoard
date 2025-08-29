"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const process_1 = __importDefault(require("process"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Loads the configuration from the environment variables.
 * It will use the NODE_ENV variable to decide which .env file to use.
 * If NODE_ENV is not set, it will use the .env.development file.
 * If the file doesn't exist, it will continue without loading it.
 * @returns {void} Nothing
 */
const loadConfig = () => {
    var _a;
    const env = (_a = process_1.default.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development";
    const filepath = path_1.default.join(process_1.default.cwd(), `.env.${env}`);
    // Check if the environment file exists before trying to load it
    if (fs_1.default.existsSync(filepath)) {
        console.log(`Loading environment from: ${filepath}`);
        dotenv_1.default.config({ path: filepath });
    }
    else {
        console.log(`Environment file not found: ${filepath}`);
        console.log('Using system environment variables');
    }
    // Set default values if not present
    if (!process_1.default.env.PORT) {
        process_1.default.env.PORT = '5000';
        console.log('Setting default PORT to 5000');
    }
};
exports.loadConfig = loadConfig;
