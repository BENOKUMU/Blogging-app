const express = require('express');

// middlewares
const { verifyJWT } = require("../../../middlewares/index.js");

const { newNotifications, notifications, allNotificationsCount } = require("../controllers/notification.js");

const router = express.Router();

router.get("/new", verifyJWT, newNotifications);
router.post("", verifyJWT, notifications);
router.post("/count", verifyJWT, allNotificationsCount);

module.exports = router;
