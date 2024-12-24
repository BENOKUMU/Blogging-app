const express = require('express');

// middlewares
const { verifyJWT } = require("../../../middlewares/index.js");

const {
    signup,
    signin,
    googleAuth,
    changePassword,
} = require("../controllers/auth.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google-auth", googleAuth);
router.post("/change-password", verifyJWT, changePassword);

module.exports = router;
