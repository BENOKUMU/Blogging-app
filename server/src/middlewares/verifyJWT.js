const jwt = require("jsonwebtoken");

// config
const { jwtTokenSecret } = require("../configs/index.js");

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    
    // Check if authorization header exists and contains the Bearer token
    if (!authHeader) {
        return res.status(401).json({
            status: 6001,
            message: "Access token not found. Please provide a valid token.",
        });
    }

    // Extract token from the Authorization header (Bearer <token>)
    const token = authHeader.split(" ")[1];

    // If token is missing after splitting, return 401
    if (!token) {
        return res.status(401).json({
            status: 6001,
            message: "Access token not found. Please provide a valid token.",
        });
    }

    // Verify the JWT token with secret key
    jwt.verify(token, jwtTokenSecret, (error, user) => {
        if (error) {
            return res.status(403).json({
                status: 6001,
                message: "Invalid or expired access token.",
            });
        }

        // Attach decoded user information to the request object
        req.user = user;  // Assuming the token contains user info
        next();  // Proceed to the next middleware or route handler
    });
};

module.exports = verifyJWT;
