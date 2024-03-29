const ChatRoom = ({ messages }) => {
    if (!messages.length) return;
    return (
        <ul className='flex flex-col bg-transparent '>
            {messages &&
                messages.map(
                    ({ photoURL, text, uid, displayName, sender, msgId }) => (
                        <li
                            className={`flex m-1 mensagem ${
                                sender !== uid ? 'flex-row-reverse' : ''
                            }`}
                            key={msgId}
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
                                    <p className='p-1 text-indigo-900'>
                                        {displayName}
                                    </p>
                                </span>
                                <p className='text-sm p-1'>{text}</p>
                            </div>
                        </li>
                    )
                )}
        </ul>
    );
};

export default ChatRoom;
