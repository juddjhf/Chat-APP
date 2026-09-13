function Messages({ messages }) {

    // =========================
    // FORMAT MESSAGE TIME
    // =========================

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

            {/* NO MESSAGES */}

            {messages.length === 0 ? (

                <p className="no-messages">
                    No messages yet.
                </p>

            ) : (

                /* MESSAGE LIST */

                messages.map((item) => (

                    <div
                        className="message"
                        key={item._id}
                    >

                        {/* NICKNAME */}

                        <strong>
                            {item.nickname}
                        </strong>


                        {/* MESSAGE */}

                        <p>
                            {item.message}
                        </p>


                        {/* TIME */}

                        <small className="message-time">
                            {formatTime(item.createdAt)}
                        </small>

                    </div>

                ))

            )}

        </div>
    );
}


export default Messages;

