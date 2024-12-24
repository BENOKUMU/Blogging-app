const express = require('express');

// middlewares
const { verifyJWT } = require("../../../middlewares/index.js");

const {
    adminLogin,
    getAllUsers,
    deleteUser,
    deleteBlog,
    addComplaint,
    getComplaints,
} = require("../controllers/admin.js");

const router = express.Router();

router.post("/login", adminLogin);
router.get("/all-users", verifyJWT, getAllUsers);
router.post("/delete-user", verifyJWT, deleteUser);
router.post("/delete-blog", verifyJWT, deleteBlog);
router.post("/add-report", verifyJWT, addComplaint);
router.get("/get-reports", verifyJWT, getComplaints);

module.exports = router;
