const mongoose = require("mongoose");

const Message = require("../model/Message.model");
const Group = require("../model/Group.model");


// CREATE MESSAGE
const createMessage = async (req, res) => {
    try {
        const {
            groupId,
            nickname,
            message
        } = req.body;

        // Check required fields
        if (!groupId || !nickname || !message) {
            return res.status(400).json({
                success: false,
                message: "Group ID, nickname and message are required"
            });
        }

        // Check valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid group ID"
            });
        }

        // Check group exists
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        // Create message
        const newMessage = await Message.create({
            groupId,
            nickname: nickname.trim(),
            message: message.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Message saved successfully",
            data: newMessage
        });

    } catch (error) {
        console.log("Create Message Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save message"
        });
    }
};


// GET OLD MESSAGES
const getMessages = async (req, res) => {
    try {
        const { groupId } = req.params;

        // Check valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid group ID"
            });
        }

        // Check group exists
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: "Group not found"
            });
        }

        // Get messages
        const messages = await Message
            .find({ groupId })
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: messages
        });

    } catch (error) {
        console.log("Get Messages Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
};


module.exports = {
    createMessage,
    getMessages
};