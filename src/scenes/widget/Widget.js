import { useState } from 'react';
import { Icon } from 'components';
import Message from 'container/message/Message';
import FormMessage from 'container/message/FormMessage';

function Widget(){

  const [isOpen, setIsOpen] = useState(false)

  const onShowChat = e => {
    e.preventDefault()
    setIsOpen(prev => !prev)
  }

  return (
    <>
      <div 
        className={`
        bg-white
          border
          rounded 
          fixed 
          bottom-5 
          right-5 
          cursor-pointer ${isOpen ? '' : 'hidden'}
          h-96
          w-80
          min-w-80
          flex 
          flex-col
        `}>
        <div className="flex space-x-2 items-center border-b rounded-t h-10 min-h-10 px-2 bg-blue-800">
          <div>
            <Icon.Chat className="w-7 h-7 fill-current text-white"/>
          </div>
          <div className="flex-1 text-white">
            E-Chat
          </div>
          <div>
            <Icon.Close onClick={onShowChat} className="w-4 h-4 cursor-pointer fill-current text-white" />
          </div>
          
        </div>
        <Message room_id={16} user_id={2}/>
        <FormMessage room_id={16}/>
      </div>
      <div 
        onClick={onShowChat}
        className={`bg-blue-800 rounded-full w-auto absolute bottom-5 right-5 p-3 cursor-pointer ${isOpen ? 'hidden' : ''}`}>
        <Icon.Chat className="w-10 h-10 fill-current text-white m-auto"/>
      </div>
    </>
  )
}

export default Widget