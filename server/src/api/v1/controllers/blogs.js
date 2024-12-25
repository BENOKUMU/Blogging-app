// Import the necessary modules
const crypto = require('crypto');

// Models
const Blog = require("../../../models/Blog.js");
const User = require("../../../models/User.js");
const Notification = require("../../../models/Notification.js");
const Comment = require("../../../models/Comment.js");

// Configs
const cloudinary = require("cloudinary").v2;

// Helper function to generate a unique ID using crypto
const generateUniqueId = (input) => 
    crypto.createHash('sha256').update(input).digest('hex').substring(0, 16); // Generates a 16-character hash

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateUploadUrl = async () => {
    try {
        const date = new Date();
        const imageName = `${generateUniqueId(`${date.getTime()}-${Math.random()}`)}-${date.getTime()}.jpeg`;

        // Generate a Cloudinary upload preset if needed
        const options = {
            public_id: imageName, // Use the unique image name
            folder: "Blogging-app", // Optional folder for organization
            overwrite: true,
            resource_type: "image", // Specify the resource type
        };

        // Return a signed upload URL using Cloudinary API
        const signature = cloudinary.utils.api_sign_request(
            options,
            process.env.CLOUDINARY_API_SECRET
        );

        const uploadParams = {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            timestamp: options.timestamp,
            public_id: options.public_id,
            folder: options.folder,
            signature,
        };

        // Return the signed URL and parameters
        return {
            uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
            uploadParams,
        };
    } catch (error) {
        console.error("Error generating upload URL for Cloudinary:", error);
        throw error;
    }
};


const getUploadUrl = async (req, res) => {
	generateUploadUrl()
		.then((url) =>
			res.status(200).json({
				status: 6000,
				uploadUrl: url,
			})
		)
		.catch((error) =>
			res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		)
}

const createBlog = async (req, res) => {
    const authorId = req.user.id;
    let { title, content, des, tags, banner, draft, id } = req?.body;

    if (!title) {
        return res.status(403).json({
            status: 6001,
            message: "You must provide a title to publish the blog",
        });
    }

    if (!draft) {
        if (!des || des.length > 200) {
            return res.status(403).json({
                status: 6001,
                message:
                    "You must provide blog description under 200 characters",
            });
        }

        if (!banner) {
            return res.status(403).json({
                status: 6001,
                message: "You must provide a banner to publish it",
            });
        }

        if (!content.blocks.length) {
            return res.status(403).json({
                status: 6001,
                message: "There must be some blog content to publish it",
            });
        }

        if (!tags || tags.length > 10) {
            return res.status(403).json({
                status: 6001,
                message:
                    "Provide tags in order to publish the blog, Maximum 10",
            });
        }
    }

    tags = tags && tags.map((tag) => tag.toLowerCase());

    // Slugify the title + unique hash for blog_id
    const blog_id =
        id ||
        title
            .replace(/[^a-zA-Z0-9]/g, " ")
            .replace(/\s+/g, "-")
            .trim() + generateUniqueId(`${title}-${Date.now()}`);

    if (id) {
        Blog.findOneAndUpdate(
            { blog_id },
            { title, des, banner, content, tags, draft: draft ? draft : false }
        )
            .then(() => {
                res.status(200).json({
                    status: 6000,
                    message: "Successfully updated",
                    blogId: blog_id,
                });
            })
            .catch((error) => {
                res.status(500).json({
                    status: 6001,
                    message: error?.message,
                });
            });
    } else {
        const blog = new Blog({
            title,
            des,
            content,
            tags,
            banner,
            author: authorId,
            blog_id,
            draft: Boolean(draft), // the boolean() will help set correct value
        });

        blog.save()
            .then((blog) => {
                let incrementVal = draft ? 0 : 1;

                // Update the User model to increment the total_posts count and push the new blog post in user blogs
                User.findOneAndUpdate(
                    { _id: authorId },
                    {
                        $inc: { "account_info.total_posts": incrementVal },
                        $push: { blogs: blog._id },
                    }
                )
                    .then((user) => {
                        res.status(200).json({
                            status: 6000,
                            message: "Successfully created",
                            blogId: blog.blog_id,
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            status: 6001,
                            message: "Failed to update the total post count",
                        });
                    });
            })
            .catch((error) => {
                return res.status(500).json({
                    status: 6001,
                    message: error?.message,
                });
            });
    }
};

const latestBlogs = async (req, res) => {
	const { page } = req.body

	const maxLimit = 5

	Blog.find({ draft: false })
		.populate(
			"author",
			"personal_info.profile_img personal_info.username personal_info.fullName -_id"
		)
		.sort({ publishedAt: -1 })
		.select("blog_id title des banner activity tags publishedAt -_id")
		.skip((page - 1) * maxLimit) // skip() will skip documents
		.limit(maxLimit)
		.then((blogs) => {
			return res.status(200).json({
				status: 6000,
				blogs,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

const latestBlogsCount = async (req, res) => {
	/**
	 * countDocuments() will give the total count of document
	 * present in the collection
	 */
	Blog.countDocuments({ draft: false })
		.then((count) => {
			return res.status(200).json({
				status: 6000,
				totalDocs: count,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

const trendingBlogs = async (req, res) => {
	Blog.find({ draft: false })
		.populate(
			"author",
			"personal_info.profile_img personal_info.username personal_info.fullName -_id"
		)
		.sort({
			"activity.total_read": -1,
			"activity.total_likes": -1,
			publishedAt: -1,
		})
		.select("blog_id title publishedAt -_id")
		.limit(5)
		.then((blogs) => {
			return res.status(200).json({
				status: 6000,
				blogs,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

const searchBlogs = async (req, res) => {
	/**
	 * $ne: `eliminate_blog` => this will find only blog id not equals to `eliminate_blog`
	 */
	const { tag, query, author, page, limit, eliminate_blog } = req.body

	let findQuery

	if (tag) {
		findQuery = {
			tags: tag,
			draft: false,
			blog_id: { $ne: eliminate_blog },
		}
	} else if (query) {
		findQuery = { draft: false, title: new RegExp(query, "i") }
	} else if (author) {
		findQuery = { author, draft: false }
	}

	const maxLimit = limit ? limit : 2

	Blog.find(findQuery)
		.populate(
			"author",
			"personal_info.profile_img personal_info.username personal_info.fullName -_id"
		)
		.sort({ publishedAt: -1 })
		.select("blog_id title des banner activity tags publishedAt -_id")
		.skip((page - 1) * maxLimit)
		.limit(maxLimit)
		.then((blogs) => {
			return res.status(200).json({
				status: 6000,
				blogs,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

const searchBlogsCount = async (req, res) => {
	const { tag, author, query } = req.body

	let findQuery

	if (tag) {
		findQuery = { tags: tag, draft: false }
	} else if (query) {
		findQuery = { draft: false, title: new RegExp(query, "i") }
	} else if (author) {
		findQuery = { author, draft: false }
	}

	Blog.countDocuments(findQuery)
		.then((count) => {
			return res.status(200).json({
				status: 6000,
				totalDocs: count,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

const getBlog = async (req, res) => {
	/**
	 * `$inc => incrementing something`
	 */

	const { blog_id, draft, mode } = req.body

	const incrementVal = mode !== "edit" ? 1 : 0

	Blog.findOneAndUpdate(
		{ blog_id },
		{ $inc: { "activity.total_reads": incrementVal } }
	)
		.populate(
			"author",
			"personal_info.fullName personal_info.username personal_info.profile_img"
		)
		.select("title des content banner activity publishedAt blog_id tags")
		.then((blog) => {
			/**
			 * updating the `total_reads` count from the author details
			 *
			 * `findOneAndUpdate` is a promise so should need the catch method.
			 */
			User.findOneAndUpdate(
				{
					"personal_info.username":
						blog.author.personal_info.username,
				},
				{ $inc: { "account_info.total_reads": incrementVal } }
			).catch((error) => {
				return res.status(500).json({
					status: 6001,
					message: error?.message,
				})
			})

			if (blog.draft && !draft) {
				return res.status(500).json({
					status: 6001,
					message: "You can not access draft blogs",
				})
			}

			return res.status(200).json({
				status: 6000,
				blog,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

const likeBlog = async (req, res) => {
	const user_id = req.user

	const { _id, isUserLiked } = req.body

	const incrementVal = !isUserLiked ? 1 : -1

	Blog.findOneAndUpdate(
		{ _id },
		{ $inc: { "activity.total_likes": incrementVal } }
	).then((blog) => {
		if (!isUserLiked) {
			const like = new Notification({
				type: "like",
				blog: _id,
				notification_for: blog.author,
				user: user_id,
			})

			like.save().then((notification) => {
				return res.status(200).json({
					status: 6000,
					liked_by_user: true,
				})
			})
		} else {
			Notification.findOneAndDelete({
				user: user_id,
				blog: _id,
				type: "like",
			})
				.then((data) => {
					return res.status(200).json({
						status: 6000,
						liked_by_user: false,
					})
				})
				.catch((error) => {
					return res.status(500).json({
						status: 6001,
						message: error?.message,
					})
				})
		}
	})
}

const isUserLiked = async (req, res) => {
	/**
	 * request for sending information about currently logged
	 * user is liked the blog post or not
	 */

	const user_id = req.user

	const { _id } = req.body

	Notification.exists({ user: user_id, type: "like", blog: _id })
		.then((result) => {
			return res.status(200).json({
				status: 6000,
				result,
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

const deleteBlog = (req, res) => {
	const user_id = req.user

	const { blog_id } = req.body

	Blog.findOneAndDelete({ blog_id })
		.then((blog) => {
			/**
			 * deleting all of the notifications and
			 * comments based on the blog
			 */

			Notification.deleteMany({ blog: blog._id }).then((data) =>
				console.log("Notification deleted")
			)

			Comment.deleteMany({ blog_id: blog._id }).then((data) =>
				console.log("Comment deleted")
			)

			User.findOneAndUpdate(
				{ _id: user_id },
				{
					$pull: { blog: blog._id },
					$inc: { "account_info.total_posts": -1 },
				}
			).then(() => {
				console.log("Blog deleted")
			})

			return res.status(200).json({
				status: 6000,
				message: "Deleted",
			})
		})
		.catch((error) => {
			return res.status(500).json({
				status: 6001,
				message: error?.message,
			})
		})
}

module.exports = { generateUploadUrl, getUploadUrl, createBlog, latestBlogs, latestBlogsCount, trendingBlogs, searchBlogs, searchBlogsCount, getBlog, likeBlog, isUserLiked, deleteBlog };
