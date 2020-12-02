
import { useState } from 'react';
import { useMutation, gql } from 'graphql/client';


const ADD_MESSAGES = gql`
mutation SendMessage($room_id: ID!, $message: String!){
  createMessage(room_id:$room_id, message:$message)
}
`;

function FormMessage({ room_id }){
  const [message, setMessage] = useState('')
  const [addMessage] = useMutation(ADD_MESSAGES) 

  const onAddMessage = e => {
    e.preventDefault()
    addMessage({
      variables: {
        message: message,
        room_id
      }
    })
    setMessage('')
  }

  return (
    <form onSubmit={onAddMessage}>
      <input 
        placeholder="Type a message..."
        className="border border-gray-300 rounded-full w-full h-10 px-5"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
    </form>
  )
}

export default FormMessage