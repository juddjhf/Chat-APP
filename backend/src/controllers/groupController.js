const bcrypt = require("bcryptjs");

const Group = require("../model/Group.model");
const generateGroupCode = require("../utils/generateGroupCode");

// CREATE GROUP
const createGroup = async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({
                success: false,
                message: "Group name and password are required"
            });
        }

        const groupName = name.trim();

        if (groupName.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Group name must be at least 2 characters"
            });
        }

        if (password.length < 4) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 4 characters"
            });
        }

        let groupCode;
        let existingGroup;

        do {
            groupCode = generateGroupCode();

            existingGroup = await Group.findOne({
                groupCode
            });
        } while (existingGroup);

        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        const group = await Group.create({
            name: groupName,
            groupCode,
            passwordHash
        });

        return res.status(201).json({
            success: true,
            message: "Group created successfully",
            groupCode: group.groupCode
        });

    } catch (error) {
        console.log("Create Group Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create group"
        });
    }
};


// JOIN GROUP
const joinGroup = async (req, res) => {
    try {
        const {
            groupCode,
            password,
            nickname
        } = req.body;

        // Check required fields
        if (!groupCode || !password) {
            return res.status(400).json({
                success: false,
                message: "Group code and password are required"
            });
        }

        // Find group
        const group = await Group.findOne({
            groupCode: groupCode.toUpperCase().trim()
        });

        // Group not found
        if (!group) {
            return res.status(401).json({
                success: false,
                message: "Invalid group code or password"
            });
        }

        // Check password
        const isPasswordMatch = await bcrypt.compare(
            password,
            group.passwordHash
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid group code or password"
            });
        }

        // Nickname optional
        const userNickname = nickname?.trim() || "Guest";

        return res.status(200).json({
            success: true,
            message: "Group joined successfully",

            group: {
                id: group._id,
                name: group.name,
                groupCode: group.groupCode
            },

            nickname: userNickname
        });

    } catch (error) {
        console.log("Join Group Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to join group"
        });
    }
};


module.exports = {
    createGroup,
    joinGroup
};