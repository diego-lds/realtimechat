const ChatRoom = ({ messages, userId }) => {
    console.log('Chat ROom');

    return (
        <ul className='flex flex-col bg-transparent '>
            {messages &&
                messages.map(msg => <ChatMessage {...msg} userId={userId} />)}
        </ul>
    );
};

export function ChatMessage({
    photoURL,
    text,
    id,
    userId,
    displayName,

    sender,
}) {
    const matchMe = userId !== sender;
    console.log(userId, sender);
    return (
        <li
            className={`flex m-1 mensagem ${matchMe ? 'flex-row-reverse' : ''}`}
            key={id}
        >
            <img
                className='m-2 rounded-full self-start'
                alt='user face'
                src={photoURL || 'default-profile.svg'}
                width={50}
                height={50}
            />

            <div className=' rounded-xl p-1 max-w-screen-sm  border-gray-200 text-justify break-all drop-shadow-lg  bg-white'>
                <span>
                    <p className='text-sm font-san p-1 font-extrabold text-indigo-900'>
                        {displayName}
                    </p>
                </span>
                <p className='text-sm p-1'>{text}</p>
            </div>
        </li>
    );
}

export default ChatRoom;
