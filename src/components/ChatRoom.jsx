import { useAuthState } from 'react-firebase-hooks/auth';
import './ChatRoom.css';

const ChatRoom = ({ messages, reference }) => {
    if (messages.length === 0) return;
    return (
        <div>
            <ul>
                {messages.length &&
                    messages.map(msg => {
                        return <ChatMessage {...msg} />;
                    })}
                <span ref={reference}></span>
            </ul>
        </div>
    );
};

function ChatMessage({ displayName, photoURL, text, id, uid, userIdMatch }) {
    return (
        <li className={userIdMatch ? 'teste' : ''} key={id}>
            <div>
                <img alt='user face' src={photoURL} width={50} />
                <div>
                    <p>{text}</p>
                </div>
            </div>
        </li>
    );
}

export default ChatRoom;
