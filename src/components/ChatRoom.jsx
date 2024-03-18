import './ChatRoom.css';

const ChatRoom = ({ messages, reference }) => {
    if (messages.length === 0) return;
    return (
        <div className='chat-room'>
            <ul className='chat-list'>
                {messages.length &&
                    messages.map(msg => {
                        return <ChatMessage {...msg} />;
                    })}
                <span ref={reference}></span>
            </ul>
        </div>
    );
};

function ChatMessage({ displayName, photoURL, text, id }) {
    return (
        <li key={id}>
            <div className='chat-message'>
                <img alt='user face' src={photoURL} width={50} />
                <div className='text-content'>
                    <p>{text}</p>
                </div>
            </div>
        </li>
    );
}

export default ChatRoom;
