const express = require('express');

// middlewares
const { verifyJWT } = require("../../../middlewares/index.js");

const {
    searchUsers,
    userProfile,
    updateProfileImg,
    updateProfile,
    getUserBlogs,
    getUserBlogsCount,
} = require("../controllers/users.js");

const router = express.Router();

router.post("/search", searchUsers);
router.post("/profile", userProfile);
router.post("/update-profile-img", verifyJWT, updateProfileImg);
router.post("/update-profile", verifyJWT, updateProfile);
router.post("/blogs", verifyJWT, getUserBlogs);
router.post("/blogs-count", verifyJWT, getUserBlogsCount);

module.exports = router;
