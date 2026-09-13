const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },

        nickname: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;