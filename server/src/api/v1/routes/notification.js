const express = require('express');

// Middlewares
const { verifyJWT } = require("../../../middlewares"); // Ensure path is correct

// Controllers
const { newNotifications, notifications, allNotificationsCount } = require("../controllers/notification.js");

const router = express.Router();

// Define routes
router.get("/new", verifyJWT, newNotifications); // Route to check for new notifications
router.post("/", verifyJWT, notifications); // Route to fetch notifications
router.post("/count", verifyJWT, allNotificationsCount); // Route to get all notification count

module.exports = router;
