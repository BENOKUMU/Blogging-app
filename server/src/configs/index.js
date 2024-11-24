import { createRequire } from "module";
import { cloudinary } from "./cloudinaryConfig.js";
import dotenv from 'dotenv';
dotenv.config();

const require = createRequire(import.meta.url);
const serviceAccountKey = require("../firebase.json");

const mongoConfig = {
    connectionUrl: process.env.DB_LOCATION,
};

const serverConfig = {
    ip: "127.0.0.1",
    port: process.env.PORT || 9001,
};

const jwtTokenSecret = process.env.SECRET_ACCESS_KEY;

export { mongoConfig, serverConfig, jwtTokenSecret, serviceAccountKey, cloudinary };
