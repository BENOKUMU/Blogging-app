const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema(
    {
        blog_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "blogs",
        },
        blog_author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "blogs",
        },
        comment: {
            type: String,
            required: true,
        },
        children: {
            type: [Schema.Types.ObjectId],
            ref: "comments",
        },
        commented_by: {
            type: Schema.Types.ObjectId,
            require: true,
            ref: "users",
        },
        isReply: {
            type: Boolean,
            default: false,
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "comments",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
