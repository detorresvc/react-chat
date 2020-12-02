import React, { useEffect, useRef, useState } from 'react';
import { useQuery, gql } from 'graphql/client';
import FormMessage from './FormMessage';

const MESSAGES = gql`
query getRoomMessages($room_id: ID!, $page: Int){
  roomMessages(room_id: $room_id, page: $page) {
    pagination {
      page,
      pageCount
    }
    messages {
      id,
      room_id,
      user_id,
      message,
      created_at,
      updated_at,
      user {
        name
      }
    }
  }
}
`;

const MESSAGE_ADDED = gql`
subscription subscibemessage {
  messageAdded {
    id
    room_id
    user_id
    message
    created_at,
    updated_at,
    user {
      name
    }
  }
}
`;

function Message({ user_id, room_id }){
  const [page, setPage] = useState(1)
  const messagesRef = useRef()
  
  const scrollToBottom = () => {
    const div = messagesRef.current
    div.scrollTop = div.scrollHeight - div.clientHeight;
  }

  const { 
    data: { 
      roomMessages: { messages, pagination } 
    } = { roomMessages: {
      messages: [], 
      pagination: {}
    } }, 
    loading,
    subscribeToMore,
    fetchMore
  } = useQuery(MESSAGES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      room_id,
      page
    },
    onCompleted: ({ roomMessages }) => {   
      console.log('y')   
      if(roomMessages.pagination.page === 1){
        scrollToBottom()
      }
    }
  })
  
  const subscribeToNewMessage = () => {
    return subscribeToMore({
      document: MESSAGE_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        
        const newFeedItem = subscriptionData.data.messageAdded;
        
        const isMe = +newFeedItem.user_id === +user_id
        if(isMe){
          setTimeout(() => {
            scrollToBottom()
          }, 100)
        }

        return {
          ...prev,
          roomMessages: {
            ...prev.roomMessages,
            messages: [
              ...prev.roomMessages.messages, 
              newFeedItem
            ]
          }
        }
      }
    })
  }
  
  const onHandlefetchMore = () => {
    
    const nextPage = pagination.page + 1
    
    if(nextPage <= pagination.pageCount)

      fetchMore({
        variables: {
          room_id,
          page: nextPage
        },
        updateQuery: (prevData, { fetchMoreResult }) => {
          
          const div = messagesRef.current
          div.scrollTop = div.scrollHeight/fetchMoreResult.roomMessages.pagination.page
          
          fetchMoreResult.roomMessages.messages = [
            ...fetchMoreResult.roomMessages.messages,
            ...prevData.roomMessages.messages,
          ]
          return fetchMoreResult
        }
      })
  }

  useEffect(() => {
    subscribeToNewMessage()

  }, [])

  useEffect(() => {
    const div = messagesRef.current

    const fethMoreMessages = () => {
      if(+div.scrollTop === 0)
        onHandlefetchMore()
    }

    div.addEventListener("scroll", fethMoreMessages);

    return () => {
      div.removeEventListener('scroll', fethMoreMessages)
    }
  }, [pagination])
 
  
  return (
    <div className="flex flex-col">
      <div ref={messagesRef} className="flex flex-col overflow-auto" style={{ height: 'calc(100vh - 55px)' }}>
        {pagination.page === pagination.pageCount && <p className="w-full text-center">*** end of line ***</p>}
        {loading && <p className="w-full text-center">Loading...</p>}
        {messages.map(message => {
          const isMe = user_id === message.user_id
          return (
            <div key={`${message.user_id}${message.id}`} className={`flex flex-col p-2 ${isMe ? 'items-end' : 'items-start'}`}>
              <small className="text-xs">{message.user?.name}</small>
              <div className="my-1">
                <p className={`max-w-prose text-sm rounded-full px-3 py-2 flex-0 ${isMe ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white'}`}>{message.message}</p>
              </div>
              <small className="text-xs">{message.created_at}</small>
            </div>
          )
        })}
      </div>
      <div className="h-10 p-2">
        <FormMessage room_id={room_id}/>
      </div>
    </div>
  )

}

export default Message