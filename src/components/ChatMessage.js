const ChatMessage = ({ displayName, photoURL, text, id }) => {
  return (
    <div className='chat-message'>
      <img alt='User profile' src={photoURL} />
      {/* <h4>{displayName}</h4> */}
      <div className='message-content'>
        <span>{displayName}</span>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default ChatMessage
