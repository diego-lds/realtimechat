const ChatRoom = ({ messages, reference }) => {
    return (
        <ul className='flex flex-col max-h-full   mt-2 bg-stone-200 '>
            {messages?.length &&
                messages.map(msg => {
                    return <ChatMessage {...msg} />;
                })}
            <span ref={reference} />
        </ul>
    );
};

function ChatMessage({ displayName, photoURL, text, id, uid, userIdMatch }) {
    console.log(userIdMatch);
    return (
        <li
            className={`flex p-2 ${userIdMatch ? 'flex-row-reverse' : ''}`}
            key={id}
        >
            {/* <li className={'flex justify-end'} key={id}> */}
            <img
                className='rounded-full m-2 self-start drop-shadow-md'
                // className='rounded-full mr-3 self-start'
                alt='user face'
                src={photoURL || 'default-profile.svg'}
                width={45}
            />
            <div className='rounded-xl  rounded-tr-none border-gray-200  text-justify  break-all drop-shadow-lg p-2 bg-white'>
                <p className='text-md font-sans'>{text}</p>
                {/* <p className='break-normal'>{text}</p> */}
            </div>
        </li>
    );
}

export default ChatRoom;
