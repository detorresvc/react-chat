import React, { useEffect, useRef, useState } from 'react';
import { useQuery, gql } from 'graphql/client';
import FormMessage from './FormMessage';
import PlaceHolderAttachment from './PlaceHolderAttachment';

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
      attachments {
        id,
        filename,
        mimetype
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
    attachments {
      id,
      filename,
      mimetype
    }
  }
}
`;


const ATTACHMENT_MESSAGE_ADDED = gql`
subscription subscibemessageAttachment {
  messageAttachmentAdded {
    id
    room_id
    user_id
    message
    created_at,
    updated_at,
    user {
      name
    }
    attachments {
      id,
      filename,
      mimetype
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
    variables: {
      room_id,
      page
    },
    onCompleted: ({ roomMessages }) => {   
      if(roomMessages.pagination.page === 1){
        scrollToBottom()
      }
    }
  })

  const whichData = (type) => {
    if(type === MESSAGE_ADDED){
      return 'messageAdded'
    }

    if(type === ATTACHMENT_MESSAGE_ADDED){
      return 'messageAttachmentAdded'
    }

    return ''
  }
  
  const subscribeToNewMessage = (type) => {
    return subscribeToMore({
      document: type,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        
        const newFeedItem = subscriptionData.data[whichData(type)];
        
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
    subscribeToNewMessage(MESSAGE_ADDED)
    subscribeToNewMessage(ATTACHMENT_MESSAGE_ADDED)

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
                {message.attachments.length > 0 &&
                  <div className={`grid ${message.attachments.length > 3 ? 'grid-cols-3' : 'grid-cols-1'} gap-2 space-y-2 max-w-prose text-sm rounded px-3 py-2 flex-0 ${isMe ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {message.attachments.map(attchmnt => <PlaceHolderAttachment mimetype={attchmnt.mimetype} id={attchmnt.id}/>)}
                  </div>
                }
                {message.attachments.length === 0 &&
                  <p className={`max-w-prose text-sm rounded-full px-3 py-2 flex-0 ${isMe ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white'}`}>{message.message}</p>
                }
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