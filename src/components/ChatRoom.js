import './ChatRoom.css';

const ChatRoom = ({ messages, reference }) => {
    if (messages.length === 0) return;
    return (
        <div className='chat-room'>
            <div className='chat-wrapper'>
                <ul>
                    {messages.length &&
                        messages.map(msg => {
                            return (
                                <li
                                    key={msg.id}
                                    className='chat-message-container'
                                >
                                    <ChatMessage {...msg} />
                                </li>
                            );
                        })}
                    <span ref={reference}></span>
                </ul>
            </div>
        </div>
    );
};

function ChatMessage({ displayName, photoURL, text, id }) {
    return (
        <div className='chat-message'>
            <img alt='user profile' src={photoURL} />
            <div className='text-content'>
                <p>{text}</p>
            </div>
        </div>
    );
}

export default ChatRoom;
