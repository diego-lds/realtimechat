const ChatRoom = ({ messages }) => {
    if (!messages.length) return;

    return (
        <ul className='flex flex-col bg-transparent '>
            {messages &&
                messages.map(m => (
                    <li
                        className={`flex m-1 mensagem ${
                            m.sender !== m.uid ? 'flex-row-reverse' : ''
                        }`}
                        key={m.msgId}
                    >
                        <img
                            className='m-2 rounded-full self-start'
                            alt='user face'
                            src={m.photoURL || 'default-profile.svg'}
                            width={50}
                            height={50}
                        />
                        <div className=' rounded-xl p-1 max-w-screen-sm  border-gray-200 text-justify break-all drop-shadow-lg  bg-white'>
                            <span>
                                <p className='p-1 text-indigo-900'>
                                    {m.displayName}
                                </p>
                            </span>
                            <p className='text-sm p-1'>{m.text}</p>
                        </div>
                    </li>
                ))}
        </ul>
    );
};

export default ChatRoom;
