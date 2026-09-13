const express = require("express");

const groupController = require("../controllers/groupController");

const router = express.Router();

// Create Group
router.post(
    "/create",
    groupController.createGroup
);

// Join Group
router.post(
    "/join",
    groupController.joinGroup
);

module.exports = router;