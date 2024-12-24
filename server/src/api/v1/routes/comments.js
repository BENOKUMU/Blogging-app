const express = require('express');

// middlewares
const { verifyJWT } = require("../../../middlewares/index.js");

const { addComment, getComments, getReplies, deleteComment } = require("../controllers/comments.js");

const router = express.Router();

router.post("/add", verifyJWT, addComment);
router.post("/get", getComments);
router.post("/get/replies", getReplies);
router.post("/delete", verifyJWT, deleteComment);

module.exports = router;
