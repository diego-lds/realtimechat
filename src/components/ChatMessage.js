const ChatMessage = ({ displayName, photoURL, text, id }) => {

  return (
      <div className='chat-message'>
          <img alt='User profile' src={photoURL} />

          <div className='chat-content'>
              <span>{displayName}</span>
              <p>{text}</p>
          </div>
      </div>
  );
}

export default ChatMessage
