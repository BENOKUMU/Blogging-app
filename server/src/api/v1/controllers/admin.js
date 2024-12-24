const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// models
const Blog = require('../../../models/Blog.js');
const User = require('../../../models/User.js');
const Notification = require('../../../models/Notification.js');
const Comment = require('../../../models/Comment.js');
const Complaint = require('../../../models/Complaint.js');

// config
const { jwtTokenSecret } = require('../../../configs/index.js');

const userData = (user) => {
    const admin_token = jwt.sign({ id: user?._id }, jwtTokenSecret);
    return {
        admin_token,
        username: user?.personal_info?.username,
        fullName: user?.personal_info?.fullName,
        profile_img: user?.personal_info?.profile_img,
    };
};

const adminLogin = async (req, res) => {
    const { email, password } = req?.body;

    User.findOne({ 'personal_info.email': email })
        .then((user) => {
            if (!user) {
                return res.status(403).json({
                    status: 6001,
                    message: 'No user found with this email',
                });
            }

            if (!user.admin) {
                return res.status(403).json({
                    status: 6001,
                    message: 'You are not an admin user',
                });
            }

            bcrypt.compare(password, user.personal_info.password, (error, data) => {
                if (error) {
                    return res.status(403).json({
                        status: 6001,
                        message: 'Error please try again',
                    });
                }
                if (!data) {
                    return res.status(403).json({
                        status: 6001,
                        message: 'Password is incorrect',
                    });
                } else {
                    return res.status(200).json({
                        status: 6000,
                        message: 'Logged in successfully',
                        user: userData(user),
                    });
                }
            });
        })
        .catch((error) => {
            return res.status(500).json({ status: 6001, error: error?.message });
        });
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ admin: false }).select('personal_info');

        const formattedUsers = users.map((user) => ({
            username: user.personal_info.username,
            fullName: user.personal_info.fullName,
            profile_img: user.personal_info.profile_img,
        }));

        res.status(200).json({
            status: 6000,
            users: formattedUsers,
        });
    } catch (error) {
        res.status(500).json({
            status: 6001,
            message: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    const { user_id } = req.body;

    try {
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({
                status: 6001,
                message: 'User not found',
            });
        }

        await user.remove();

        res.status(200).json({
            status: 6000,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            status: 6001,
            message: error.message,
        });
    }
};

const deleteBlog = async (req, res) => {
    const { blog_id, username } = req.body;
    const user_id = req.user;

    const user = await User.findById(user_id);

    if (!user) {
        return res.status(404).json({
            status: 6001,
            message: 'User not found',
        });
    }

    if (!user.admin) {
        return res.status(403).json({
            status: 6001,
            message: 'You are not an admin',
        });
    }

    Blog.findOneAndDelete({ blog_id })
        .then((blog) => {
            Notification.deleteMany({ blog: blog._id }).then(() =>
                console.log('Notification deleted')
            );

            Comment.deleteMany({ blog_id: blog._id }).then(() =>
                console.log('Comment deleted')
            );

            User.findOneAndUpdate(
                { 'personal_info.username': username },
                {
                    $pull: { blog: blog._id },
                    $inc: { 'account_info.total_posts': -1 },
                }
            ).then(() => {
                console.log('Blog deleted');
            });

            return res.status(200).json({
                status: 6000,
                message: 'Deleted',
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: 6001,
                message: error?.message,
            });
        });
};

const addComplaint = async (req, res) => {
    const { report_title, report_message, target_id, targetType } = req.body;
    const user_id = req.user;

    try {
        const newComplaint = new Complaint({
            report_title,
            report_message,
            reported_by: user_id,
        });

        if (targetType === 'blog') {
            newComplaint.blog = target_id;
        } else if (targetType === 'user') {
            newComplaint.user = target_id;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid complaint target type',
            });
        }
        const savedComplaint = await newComplaint.save();

        res.status(201).json({
            success: 6000,
            complaint: savedComplaint,
        });
    } catch (error) {
        res.status(500).json({
            success: 6001,
            message: error.message,
        });
    }
};

const getComplaints = async (req, res) => {
    const user_id = req.user;

    const user = await User.findById(user_id);

    if (!user) {
        return res.status(404).json({
            status: 6001,
            message: 'User not found',
        });
    }

    if (!user.admin) {
        return res.status(403).json({
            status: 6001,
            message: 'You are not an admin',
        });
    }

    Complaint.find()
        .populate('reported_by')
        .populate('blog')
        .populate('user')
        .then((complaints) => {
            return res.status(200).json({
                status: 6000,
                complaints,
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: 6001,
                message: error?.message,
            });
        });
};

module.exports = {
    userData,
    adminLogin,
    getAllUsers,
    deleteUser,
    deleteBlog,
    addComplaint,
    getComplaints,
};
