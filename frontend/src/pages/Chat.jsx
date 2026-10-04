
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import Members from "../components/Members";
import MessageInput from "../components/MessageInput";

function Chat() {

    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [members, setMembers] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // MESSAGE SCROLL
    // =========================

    const messagesRef = useRef(null);

    // User bottom ke paas hai ya nahi
    const shouldAutoScroll = useRef(true);

    // =========================
    // GET GROUP DATA
    // =========================

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


    // =========================
    // GET OLD MESSAGES
    // =========================

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


    // =========================
    // AUTO SCROLL
    // =========================

    useEffect(() => {

        const container =
            messagesRef.current;

        if (!container) {
            return;
        }

        if (!shouldAutoScroll.current) {
            return;
        }

        requestAnimationFrame(() => {

            container.scrollTop =
                container.scrollHeight;

        });

    }, [messages]);


    // =========================
    // SOCKET.IO CONNECTION
    // =========================

    useEffect(() => {

        if (!group) {
            return;
        }

        const newSocket = io(
            import.meta.env.VITE_API_URL
        );

        setSocket(newSocket);


        // =========================
        // JOIN GROUP
        // =========================

        newSocket.emit(
            "join-group",
            {
                groupId: group.groupId,
                nickname: group.nickname
            }
        );


        // =========================
        // RECEIVE MESSAGE
        // =========================

        newSocket.on(
            "receive-message",
            (newMessage) => {

                /*
                 * New message aaya.
                 *
                 * Agar user bottom ke paas hai
                 * to auto-scroll hoga.
                 *
                 * Agar user purane messages
                 * padh raha hai to wahi rahega.
                 */

                setMessages((prev) => {

                    return [
                        ...prev,
                        newMessage
                    ];

                });

            }
        );


        // =========================
        // USER JOINED
        // =========================

        newSocket.on(
            "user-joined",
            (data) => {

                console.log(
                    `${data.nickname} joined the group`
                );

            }
        );


        // =========================
        // USER LEFT
        // =========================

        newSocket.on(
            "user-left",
            (data) => {

                console.log(
                    `${data.nickname} left the group`
                );

            }
        );


        // =========================
        // MEMBERS UPDATE
        // =========================

        newSocket.on(
            "members-update",
            (membersList) => {

                setMembers(
                    membersList
                );

            }
        );


        // =========================
        // SOCKET ERROR
        // =========================

        newSocket.on(
            "connect_error",
            (error) => {

                console.log(
                    "Socket Connection Error:",
                    error
                );

            }
        );


        // =========================
        // CLEANUP
        // =========================

        return () => {

            newSocket.disconnect();

        };

    }, [group]);


    // =========================
    // SEND MESSAGE
    // =========================

    const sendMessage = () => {

        if (!message.trim()) {
            return;
        }

        if (!socket) {
            return;
        }

        /*
         * Apna message bhejte waqt
         * hamesha bottom par jana hai.
         */

        shouldAutoScroll.current = true;

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


    // =========================
    // HANDLE MESSAGE SCROLL
    // =========================

    const handleMessagesScroll = () => {

        const container =
            messagesRef.current;

        if (!container) {
            return;
        }

        /*
         * Current position se bottom
         * kitna door hai.
         */

        const distanceFromBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;


        /*
         * 100px ke andar hai to
         * user bottom par maana jayega.
         */

        shouldAutoScroll.current =
            distanceFromBottom < 100;

    };


    // =========================
    // GROUP LOADING
    // =========================

    if (!group) {

        return (
            <p>
                Loading...
            </p>
        );

    }


    // =========================
    // UI
    // =========================

    return (

        <div className="chat-page">


            {/* ================= HEADER ================= */}

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



            {/* ================= CHAT CONTAINER ================= */}

            <div className="chat-container">


                {/* ================= CHAT MAIN ================= */}

                <main className="chat-main">


                    {/* ================= MESSAGES ================= */}

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

                        <div
                            className="messages"
                            ref={messagesRef}
                            onScroll={handleMessagesScroll}
                        >

                            {messages.length === 0 ? (

                                <p className="no-messages">
                                    No messages yet
                                </p>

                            ) : (

                                messages.map(
                                    (msg, index) => (

                                        <div
                                            key={
                                                msg._id ||
                                                msg.id ||
                                                index
                                            }
                                            className={`message ${
                                                msg.nickname ===
                                                group.nickname
                                                    ? "my-message"
                                                    : "other-message"
                                            }`}
                                        >

                                            <strong>
                                                {msg.nickname}
                                            </strong>

                                            <p>
                                                {msg.message}
                                            </p>

                                            {msg.createdAt && (

                                                <span className="message-time">
                                                    {new Date(
                                                        msg.createdAt
                                                    ).toLocaleTimeString(
                                                        [],
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        }
                                                    )}
                                                </span>

                                            )}

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    )}



                    {/* ================= MESSAGE INPUT ================= */}

                    <MessageInput
                        message={message}
                        setMessage={setMessage}
                        onSend={sendMessage}
                    />


                </main>



                {/* ================= MEMBERS ================= */}

                <aside className="chat-sidebar">

                    <Members
                        nickname={group.nickname}
                        members={members}
                    />

                </aside>


            </div>

        </div>

    );

}

export default Chat;

