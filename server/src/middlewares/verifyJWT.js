const jwt = require("jsonwebtoken");

// config
const { jwtTokenSecret } = require("../configs/index.js");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    // authHeader = "Bearer access_token"
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            status: 6001,
            message: "access token not found",
        });
    }

    jwt.verify(token, jwtTokenSecret, (error, user) => {
        if (error) {
            return res.status(403).json({
                status: 6001,
                message: "Invalid access token",
            });
        }
        req.user = user;
        next();
    });
};

module.exports = verifyJWT;
