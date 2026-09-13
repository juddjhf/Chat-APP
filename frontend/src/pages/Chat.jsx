import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import Messages from "../components/Messages";
import Members from "../components/Members";
import MessageInput from "../components/MessageInput";

function Chat() {

    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState(null);

    const [loadingMessages, setLoadingMessages] = useState(true);
    const [error, setError] = useState("");

    // GET GROUP DATA
    useEffect(() => {

        const savedGroup =
            sessionStorage.getItem("chatGroup");

        if (!savedGroup) {
            navigate("/");
            return;
        }

        try {

            const groupData =
                JSON.parse(savedGroup);

            setGroup(groupData);

        } catch (error) {

            console.log(
                "Group Data Error:",
                error
            );

            sessionStorage.removeItem(
                "chatGroup"
            );

            navigate("/");

        }

    }, [navigate]);


    // GET OLD MESSAGES
    useEffect(() => {

        if (!group) {
            return;
        }

        const getOldMessages = async () => {

            try {

                setLoadingMessages(true);
                setError("");

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/messages/${group.groupId}`
                );

                const data = await response.json();

                if (!response.ok) {

                    setError(
                        data.message ||
                        "Failed to load messages"
                    );

                    return;
                }

                setMessages(
                    data.data || []
                );

            } catch (error) {

                console.log(
                    "Get Messages Error:",
                    error
                );

                setError(
                    "Old messages load nahi ho rahe"
                );

            } finally {

                setLoadingMessages(false);

            }

        };

        getOldMessages();

    }, [group]);


    // SOCKET.IO CONNECTION
    useEffect(() => {

        if (!group) {
            return;
        }

        const newSocket = io(
            import.meta.env.VITE_API_URL
        );

        setSocket(newSocket);


        // JOIN GROUP
        newSocket.emit(
            "join-group",
            group.groupId
        );


        // RECEIVE MESSAGE
        newSocket.on(
            "receive-message",
            (newMessage) => {

                setMessages((prev) => {

                    return [
                        ...prev,
                        newMessage
                    ];

                });

            }
        );


        // SOCKET CONNECTION ERROR
        newSocket.on(
            "connect_error",
            (error) => {

                console.log(
                    "Socket Connection Error:",
                    error
                );

            }
        );


        // CLEANUP
        return () => {

            newSocket.disconnect();

        };

    }, [group]);


    // SEND MESSAGE
    const sendMessage = () => {

        if (!message.trim()) {
            return;
        }

        if (!socket) {
            return;
        }

        socket.emit(
            "send-message",
            {
                groupId: group.groupId,
                nickname: group.nickname,
                message: message.trim()
            }
        );

        setMessage("");

    };


    // GROUP DATA LOADING
    if (!group) {

        return (
            <p>
                Loading...
            </p>
        );

    }


    return (

        <div className="chat-page">


            {/* HEADER */}

            <header className="chat-header">

                <div>

                    <h1>
                        {group.groupName}
                    </h1>

                    <p>
                        Code: {group.groupCode}
                    </p>

                </div>


                <div>

                    <span>
                        {group.nickname}
                    </span>

                </div>

            </header>



            {/* CHAT CONTAINER */}

            <div className="chat-container">


                {/* CHAT MAIN */}

                <main className="chat-main">


                    {/* MESSAGES */}

                    {loadingMessages ? (

                        <div className="messages">

                            <p className="no-messages">
                                Loading messages...
                            </p>

                        </div>

                    ) : error ? (

                        <div className="messages">

                            <p className="error">
                                {error}
                            </p>

                        </div>

                    ) : (

                        <Messages
                            messages={messages}
                            currentNickname={group.nickname}
                        />

                    )}



                    {/* MESSAGE INPUT */}

                    <MessageInput
                        message={message}
                        setMessage={setMessage}
                        onSend={sendMessage}
                    />

                </main>



                {/* MEMBERS SIDEBAR */}

                <aside className="chat-sidebar">

                    <Members
                        nickname={group.nickname}
                    />

                </aside>


            </div>

        </div>

    );

}

export default Chat;



