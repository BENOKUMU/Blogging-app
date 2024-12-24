const mongoose = require('mongoose');
const { Schema } = mongoose;

const complaintSchema = new Schema(
    {
        report_title: {
            type: String,
            required: true,
        },
        report_message: {
            type: String,
            required: true,
        },
        blog: {
            type: Schema.Types.ObjectId,
            ref: 'blogs',
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        reported_by: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        // other fields...
    },
    { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
