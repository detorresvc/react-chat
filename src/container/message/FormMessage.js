
import { useState } from 'react';
import { useMutation, gql } from 'graphql/client';


const ADD_MESSAGES = gql`
mutation SendMessage($room_id: ID!, $message: String!){
  createMessage(room_id:$room_id, message:$message)
}
`;

const ADD_ATTACHMENT = gql`
mutation SendAttachment($room_id: ID!, $files: [Upload!]!){
  createAttachment(room_id:$room_id, files: $files)
}
`;

function FormMessage({ room_id }){
  const [message, setMessage] = useState('')
  const [addMessage] = useMutation(ADD_MESSAGES) 
  const [addAttachment] = useMutation(ADD_ATTACHMENT)

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

  const onChangeUpload = e => {
    e.preventDefault()
    const files = e.target.files
    console.log(files)
    addAttachment({
      variables: {
        files,
        room_id
      }
    })
  }

  return (
    <form onSubmit={onAddMessage} className="flex">
      <input 
        multiple
        type="file"
        onChange={onChangeUpload}
      />      
      <input 
        placeholder="Type a message..."
        className="border border-gray-300 rounded-full flex-1 h-10 px-5"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
    </form>
  )
}

export default FormMessage