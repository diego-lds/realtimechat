import { onSnapshot, orderBy, query } from 'firebase/firestore'
import { useState, useEffect } from 'react'

function useMessages(messagesRef) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const queryMessages = query(messagesRef, orderBy('createdAt'))
    const unsuscribe = onSnapshot(queryMessages, snapshot => {
      let result = []
      snapshot.forEach(doc => result.push({ ...doc.data(), id: doc.id }))
      setMessages(result)
    })
    return () => unsuscribe()
  }, [])

  return { messages }
}

export default useMessages
