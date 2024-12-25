const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getAuth } = require("firebase-admin/auth");
const crypto = require("crypto");

// Config
const { jwtTokenSecret } = require("../../../configs");
// Utils
const { EMAIL_REGEX, PASSWORD_REGEX } = require("../../../utils");
// Models
const User = require("../../../models/User");

// Helper function to create user data for response
const userData = (user) => {
    const access_token = jwt.sign({ id: user?._id }, jwtTokenSecret);
    return {
        access_token,
        username: user?.personal_info?.username,
        fullName: user?.personal_info?.fullName,
        profile_img: user?.personal_info?.profile_img,
    };
};

// Helper function to generate a unique username
const generateUsername = async (email) => {
    const usernameBase = email.split("@")[0];
    const hash = crypto.createHash("sha256").update(email).digest("hex").slice(0, 5); // 5-character hash

    let username = `${usernameBase}${hash}`;
    const isUsernameExists = await User.exists({
        "personal_info.username": username,
    });

    if (isUsernameExists) {
        // If there's still a conflict, hash the existing username to create a new one
        username = `${usernameBase}${crypto.createHash("sha256").update(username).digest("hex").slice(0, 5)}`;
    }

    return username;
};

// Signup function
const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || fullName.length < 3) {
        return res.status(403).json({
            status: 6001,
            message: "Full name must be at least 3 letters long",
        });
    }
    if (!email) {
        return res.status(403).json({ status: 6001, message: "Enter email" });
    }
    if (!EMAIL_REGEX.test(email)) {
        return res
            .status(403)
            .json({ status: 6001, message: "Email is invalid" });
    }
    if (!PASSWORD_REGEX.test(password)) {
        return res.status(403).json({
            status: 6001,
            message:
                "Password should be 6 to 20 characters long with a numeric, 1 lowercase, and 1 uppercase letter",
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const username = await generateUsername(email);

        const user = new User({
            personal_info: {
                fullName,
                email,
                password: hashedPassword,
                username,
            },
        });

        const savedUser = await user.save();
        return res.status(200).json({
            status: 6000,
            message: "User created successfully",
            user: userData(savedUser),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(500)
                .json({ status: 6001, message: "Email already exists" });
        }
        return res.status(500).json({
            status: 6001,
            message: error?.message,
        });
    }
};

// Signin function
const signin = async (req, res) => {
    const { email, password } = req?.body;

    try {
        const user = await User.findOne({ "personal_info.email": email });

        if (!user) {
            return res.status(403).json({
                status: 6001,
                message: "No user found with this email",
            });
        }

        if (!user.google_auth) {
            const isPasswordValid = await bcrypt.compare(
                password,
                user.personal_info.password
            );

            if (!isPasswordValid) {
                return res.status(403).json({
                    status: 6001,
                    message: "Password is incorrect",
                });
            }

            return res.status(200).json({
                status: 6000,
                message: "Logged in successfully",
                user: userData(user),
            });
        } else {
            return res.status(403).json({
                status: 6001,
                message:
                    "Account was created using Google. Try logging in with Google.",
            });
        }
    } catch (error) {
        return res.status(500).json({ status: 6001, error: error?.message });
    }
};

// Google Authentication
const googleAuth = async (req, res) => {
    const { access_token } = req?.body;

    try {
        const decodedUser = await getAuth().verifyIdToken(access_token);
        let { email, name, picture } = decodedUser;
        picture = picture.replace("s96-c", "s384-c");

        let user = await User.findOne({ "personal_info.email": email }).select(
            "personal_info.fullName personal_info.username personal_info.profile_img google_auth"
        );

        if (user) {
            if (!user.google_auth) {
                return res.status(403).json({
                    status: 6001,
                    message:
                        "This email was signed up without Google. Please login with a password to access the account",
                });
            }
        } else {
            const username = await generateUsername(email);

            user = new User({
                personal_info: {
                    fullName: name,
                    email,
                    profile_img: picture,
                    username,
                },
                google_auth: true,
            });

            await user.save();
        }

        return res.status(200).json({
            status: 6000,
            message: "Logged in successfully",
            user: userData(user),
        });
    } catch (error) {
        return res.status(500).json({
            status: 6001,
            message:
                "Failed to authenticate you with this Google account. Try with another Google account",
        });
    }
};

// Change Password
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (
        !PASSWORD_REGEX.test(currentPassword) ||
        !PASSWORD_REGEX.test(newPassword)
    ) {
        return res.status(403).json({
            status: 6001,
            message:
                "Password should be 6 to 20 characters long with a numeric, 1 lowercase, and 1 uppercase letter",
        });
    }

    try {
        const user = await User.findOne({ _id: req.user });

        if (user.google_auth) {
            return res.status(403).json({
                status: 6001,
                message:
                    "You can't change the password because you logged in through Google",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.personal_info.password
        );

        if (!isPasswordValid) {
            return res.status(403).json({
                status: 6001,
                message: "Incorrect current password",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.user, {
            "personal_info.password": hashedPassword,
        });

        return res.status(200).json({
            status: 6000,
            message: "Password changed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: 6001,
            message: error?.message,
        });
    }
};

module.exports = {
    signup,
    signin,
    googleAuth,
    changePassword,
};
