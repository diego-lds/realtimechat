const ChatRoom = ({ messages }) => {
    if (!messages) return;
    if (!messages.length) return;
    return (
        <ul className='flex flex-col bg-transparent '>
            {messages.map(msg => (
                <ChatMessage {...msg} />
            ))}
        </ul>
    );
};

function ChatMessage({
    photoURL,
    text,
    id,
    userIdMatch,
    displayName,
    createdAt,
}) {
    return (
        <li
            className={`flex m-1 ${userIdMatch ? 'flex-row-reverse' : ''}`}
            key={id}
        >
            <img
                className='m-2 rounded-full self-start'
                alt='user face'
                src={photoURL || 'default-profile.svg'}
                width={50}
            />

            <div className='rounded-xl p-1 max-w-screen-sm rounded-tr-none border-gray-200 text-justify break-all drop-shadow-lg  bg-white'>
                <span>
                    <p className='text-sm font-san p-1 font-extrabold text-indigo-900'>
                        {displayName}
                    </p>
                </span>
                <p className='text-sm font-sans p-1'>{text}</p>
            </div>
        </li>
    );
}

export default ChatRoom;
