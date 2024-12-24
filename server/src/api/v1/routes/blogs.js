const express = require('express');

// middlewares
const { verifyJWT } = require("../../../middlewares/index.js");

const {
    getUploadUrl,
    createBlog,
    latestBlogs,
    trendingBlogs,
    searchBlogs,
    latestBlogsCount,
    searchBlogsCount,
    getBlog,
    likeBlog,
    isUserLiked,
    deleteBlog,
} = require("../controllers/blogs.js");

const router = express.Router();

router.get("/get-upload-url", verifyJWT, getUploadUrl);
router.post("/create", verifyJWT, createBlog);
router.get("/latest", latestBlogs);
router.get("/trending", trendingBlogs);
router.get("/search", searchBlogs);
router.get("/latest-count", latestBlogsCount);
router.get("/search-count", searchBlogsCount);
router.get("/:id", getBlog);
router.post("/like", verifyJWT, likeBlog);
router.get("/is-liked/:id", verifyJWT, isUserLiked);
router.delete("/:id", verifyJWT, deleteBlog);

module.exports = router;
