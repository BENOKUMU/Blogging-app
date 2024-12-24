const { cloudinary } = require("./cloudinaryConfig.js");
const dotenv = require('dotenv');
dotenv.config();

const serviceAccountKey = require("./firebase.js");

const mongoConfig = {
    connectionUrl: process.env.DB_LOCATION,
};

const serverConfig = {
    ip: "0.0.0.0",
    port: process.env.PORT || 9001,
};

const jwtTokenSecret = process.env.SECRET_ACCESS_KEY;

module.exports = { mongoConfig, serverConfig, jwtTokenSecret, serviceAccountKey, cloudinary };
