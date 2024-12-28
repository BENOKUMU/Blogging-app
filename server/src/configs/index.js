import dotenv from 'dotenv';
import { cloudinary } from './cloudinaryConfig.js';
import serviceAccountKey from './firebase.js';

// Load environment variables from .env file
dotenv.config();

const mongoConfig = {
    connectionUrl: process.env.DB_LOCATION,
};

const serverConfig = {
    ip: '0.0.0.0',
    port: process.env.PORT || 9001,
};

const jwtTokenSecret = process.env.SECRET_ACCESS_KEY;

// Export the configurations
export { mongoConfig, serverConfig, jwtTokenSecret, serviceAccountKey, cloudinary };
