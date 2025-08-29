import dotenv from "dotenv";
import process from "process";
import path from "path";
import fs from "fs";

/**
 * Loads the configuration from the environment variables.
 * It will use the NODE_ENV variable to decide which .env file to use.
 * If NODE_ENV is not set, it will use the .env.development file.
 * If the file doesn't exist, it will continue without loading it.
 * @returns {void} Nothing
 */
export const loadConfig = () => {
  const env = process.env.NODE_ENV ?? "development";
  const filepath = path.join(process.cwd(), `.env.${env}`);
  
  // Check if the environment file exists before trying to load it
  if (fs.existsSync(filepath)) {
    console.log(`Loading environment from: ${filepath}`);
    dotenv.config({ path: filepath });
  } else {
    console.log(`Environment file not found: ${filepath}`);
    console.log('Using system environment variables');
  }
  
  // Set default values if not present
  if (!process.env.PORT) {
    process.env.PORT = '5000';
    console.log('Setting default PORT to 5000');
  }
};
