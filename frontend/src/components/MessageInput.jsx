function MessageInput({ message, setMessage, onSend }) {

    const handleSubmit = (e) => {
        e.preventDefault();

        onSend();
    };


    return (
        <form
            className="message-input"
            onSubmit={handleSubmit}
        >

            <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) =>
                    setMessage(e.target.value)
                }
            />

            <button type="submit">
                Send
            </button>

        </form>
    );
}

export default MessageInput;