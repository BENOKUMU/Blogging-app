const bcrypt = require("bcrypt");
// const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const { getAuth } = require("firebase-admin/auth");

// config
const { jwtTokenSecret } = require("../../../configs");
// utils
const { EMAIL_REGEX, PASSWORD_REGEX } = require("../../../utils");
// models
const User = require("../../../models/User");

const loadNanoid = async () => {
    const { nanoid } = await import("nanoid");
    return nanoid;
};

const userData = (user) => {
    const access_token = jwt.sign({ id: user?._id }, jwtTokenSecret);
    return {
        access_token,
        username: user?.personal_info?.username,
        fullName: user?.personal_info?.fullName,
        profile_img: user?.personal_info?.profile_img,
    };
};

const generateUsername = async (email) => {
    let username = email.split("@")[0];

	const nanoid = await loadNanoid();
    const isUsername = await User.exists({
        "personal_info.username": username,
    }).then((result) => result);

    console.log("isUsername: ", isUsername);

    isUsername ? (username += nanoid().substring(0, 5)) : username;

    return username;
};

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

const signin = async (req, res) => {
    const { email, password } = req?.body;

    User.findOne({ "personal_info.email": email })
        .then((user) => {
            if (!user) {
                return res.status(403).json({
                    status: 6001,
                    message: "No user found with this email",
                });
            }

            if (!user.google_auth) {
                bcrypt.compare(
                    password,
                    user.personal_info.password,
                    (error, data) => {
                        if (error) {
                            return res.status(403).json({
                                status: 6001,
                                message: "Error please try again",
                            });
                        }
                        if (!data) {
                            return res.status(403).json({
                                status: 6001,
                                message: "Password is incorrect",
                            });
                        } else {
                            return res.status(200).json({
                                status: 6000,
                                message: "Logged in successfully",
                                user: userData(user),
                            });
                        }
                    }
                );
            } else {
                return res.status(403).json({
                    status: 6001,
                    message:
                        "Account was created using google. Try logging with google.",
                });
            }
        })
        .catch((error) => {
            return res.status(500).json({ status: 6001, error: error?.message });
        });
};

const googleAuth = async (req, res) => {
    const { access_token } = req?.body;

    try {
        const decodedUser = await getAuth().verifyIdToken(access_token);
        let { email, name, picture } = decodedUser;
        picture = picture.replace("s96-c", "s384-c");

        let user = await User.findOne({ "personal_info.email": email })
            .select(
                "personal_info.fullName personal_info.username personal_info.profile_img google_auth"
            );

        if (user) {
            if (!user.google_auth) {
                return res.status(403).json({
                    status: 6001,
                    message:
                        "This email was signed up without google. Please login with password to access the account",
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
                "Failed to authenticate you with this google account. Try with some other google account",
        });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (
        !PASSWORD_REGEX.test(currentPassword) ||
        !PASSWORD_REGEX.test(newPassword)
    ) {
        return res.status(403).json({
            status: 6001,
            message:
                "Password should be 6 to 20 characters long with a numeric,1 lowercase and 1 uppercase letters",
        });
    }

    User.findOne({ _id: req.user })
        .then((user) => {
            if (user.google_auth) {
                return res.status(403).json({
                    status: 6001,
                    message:
                        "You can't change the password because you logged in through google",
                });
            }

            bcrypt.compare(
                currentPassword,
                user.personal_info.password,
                (error, result) => {
                    if (error) {
                        return res.status(500).json({
                            status: 6001,
                            message:
                                "Some error occurred while changing the password, please try again later",
                        });
                    }

                    if (!result) {
                        return res.status(403).json({
                            status: 6001,
                            message: "Incorrect current password",
                        });
                    }

                    bcrypt.hash(newPassword, 10, (error, hashedPassword) => {
                        User.findOneAndUpdate(
                            { _id: req.user },
                            { "personal_info.password": hashedPassword }
                        )
                            .then(() => {
                                return res.status(200).json({
                                    status: 6000,
                                    message: "Password changed",
                                });
                            })
                            .catch(() => {
                                return res.status(500).json({
                                    status: 6001,
                                    message:
                                        "Some error occurred while saving the new password, please try again later",
                                });
                            });
                    });
                }
            );
        })
        .catch((error) => {
            return res.status(500).json({
                status: 6001,
                message: error?.message,
            });
        });
};

module.exports = {
    signup,
    signin,
    googleAuth,
    changePassword,
};
