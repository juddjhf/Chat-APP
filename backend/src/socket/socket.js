const Message = require("../model/Message.model");

const setupSocket = (io) => {

    io.on("connection", (socket) => {

        console.log("User connected:", socket.id);


        // JOIN GROUP
        socket.on("join-group", (data) => {

            const {
                groupId,
                nickname
            } = data;

            if (!groupId || !nickname) {
                return;
            }


            // Save user information inside socket
            socket.groupId = groupId;
            socket.nickname = nickname.trim();


            // Join Socket.IO room
            socket.join(groupId);


            console.log(
                `${socket.nickname} joined group ${groupId}`
            );


            // Tell other users that someone joined
            socket.to(groupId).emit(
                "user-joined",
                {
                    nickname: socket.nickname
                }
            );


            // Send updated member list
            const room = io.sockets.adapter.rooms.get(groupId);

            const members = [];

            if (room) {

                room.forEach((socketId) => {

                    const memberSocket =
                        io.sockets.sockets.get(socketId);

                    if (memberSocket) {

                        members.push({
                            nickname:
                                memberSocket.nickname
                        });

                    }

                });

            }


            io.to(groupId).emit(
                "members-update",
                members
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


            // If user was inside a group
            if (
                socket.groupId &&
                socket.nickname
            ) {

                const groupId =
                    socket.groupId;

                const nickname =
                    socket.nickname;


                // Tell remaining users
                socket.to(groupId).emit(
                    "user-left",
                    {
                        nickname: nickname
                    }
                );


                // Get remaining members
                const room =
                    io.sockets.adapter.rooms.get(
                        groupId
                    );

                const members = [];


                if (room) {

                    room.forEach((socketId) => {

                        const memberSocket =
                            io.sockets.sockets.get(
                                socketId
                            );

                        if (memberSocket) {

                            members.push({
                                nickname:
                                    memberSocket.nickname
                            });

                        }

                    });

                }


                // Update members list
                io.to(groupId).emit(
                    "members-update",
                    members
                );

            }

        });

    });

};


module.exports = setupSocket;

