function Messages({ messages, currentNickname }) {

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        );
    };

    return (
        <div className="messages">

            {messages.length === 0 ? (

                <p className="no-messages">
                    No messages yet.
                </p>

            ) : (

                messages.map((item) => {

                    const isMyMessage =
                        item.nickname === currentNickname;

                    return (
                        <div
                            className={`message ${
                                isMyMessage
                                    ? "my-message"
                                    : "other-message"
                            }`}
                            key={item._id}
                        >

                            <strong>
                                {item.nickname}
                            </strong>

                            <p>
                                {item.message}
                            </p>

                            <small className="message-time">
                                {formatTime(item.createdAt)}
                            </small>

                        </div>
                    );

                })

            )}

        </div>
    );
}

export default Messages;
