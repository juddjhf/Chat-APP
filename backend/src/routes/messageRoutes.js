const express = require("express");

const messageController = require("../controllers/messageController");

const router = express.Router();


// Save Message
router.post(
    "/",
    messageController.createMessage
);


// Get Old Messages
router.get(
    "/:groupId",
    messageController.getMessages
);


module.exports = router;