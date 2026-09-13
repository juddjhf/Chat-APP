const Message = require("../model/Message.model");

const setupSocket = (io) => {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);


        // JOIN GROUP
        socket.on("join-group", (groupId) => {

            socket.join(groupId);

            console.log(
                `Socket ${socket.id} joined group ${groupId}`
            );

        });


        // SEND MESSAGE
        socket.on("send-message", async (data) => {

            try {

                const {
                    groupId,
                    nickname,
                    message
                } = data;


                if (
                    !groupId ||
                    !nickname ||
                    !message
                ) {
                    return;
                }


                // Save message in MongoDB
                const newMessage = await Message.create({
                    groupId,
                    nickname: nickname.trim(),
                    message: message.trim()
                });


                // Send message to group
                io.to(groupId).emit(
                    "receive-message",
                    newMessage
                );


            } catch (error) {

                console.log(
                    "Socket Message Error:",
                    error
                );

            }

        });


        // DISCONNECT
        socket.on("disconnect", () => {

            console.log(
                "User disconnected:",
                socket.id
            );

        });

    });

};


module.exports = setupSocket;