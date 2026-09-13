const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        groupCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        passwordHash: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;