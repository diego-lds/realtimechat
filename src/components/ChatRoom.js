import ChatMessage from './ChatMessage'

const ChatRoom = ({ messages }) => {
  console.log('room1', messages)
  if (messages.length === 0) return
  return (
    <div className='chat-room'>
      <ul>
        {messages.length &&
          messages.map(msg => {
            return (
              <li key={messages.id} className='chat-message-container'>
                <ChatMessage {...msg} />
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default ChatRoom
