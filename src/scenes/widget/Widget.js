import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import Message from 'container/message/Message';
import FormMessage from 'container/message/FormMessage';
import { useQuery, gql, useMutation } from 'graphql/client';
import Cookies from 'js-cookie';

const CONSUMER = gql`
query onGetConsumer($access_key: String!) {
  getConsumer(access_key:$access_key) {
    name
  }
}
`;

const WIDGET_LOGIN = gql`
mutation onWigetLogIn($access_key: String!, $token: String!){
  widgetLogin(access_key: $access_key, token: $token){
    email,
    id,
    rooms {
      id
    }
  }
}
`;

function Widget({ access_key, token }){
  const [widgetStatus, setWidgetStatus] = useState('validating')
  const [isOpen, setIsOpen] = useState(false)
  const { data , loading } = useQuery(CONSUMER, {
    variables: {
      access_key
    },
    onCompleted: (data) => {
      if(data?.getConsumer)
        return setWidgetStatus('validating')
      return setWidgetStatus('error')
    }
  })

  const [widgetLogin, { 
    data: widgetdata, loading : widgetLoginLoading
  }] = useMutation(WIDGET_LOGIN, {
    onCompleted: (data) => {
      
      if(data?.widgetLogin)
        return setWidgetStatus('ready')
      return setWidgetStatus('error')
    }
  })

  useEffect(() => {
    widgetLogin({
      variables: {
        access_key,
        token
      }
    })

    Cookies.set('echat:token', token)
  }, [])

  if(widgetStatus === 'validating'){
    return (
      <div 
        className={`bg-blue-800 rounded-full w-auto fixed bottom-5 right-5 p-3`}>
        <Icon.Spinner className="animate-spin w-10 h-10 fill-current text-white m-auto"/>
      </div>
    )
  }
  
  if(widgetStatus === 'error'){
    return (
      <div 
        title="EChat: Something went wrong!"
        className={`bg-white rounded-full w-auto fixed bottom-5 right-5 p-3`}>
        <Icon.Exclamation className="w-10 h-10 fill-current text-white m-auto"/>
      </div>
    )
  }

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
            E-Chat: {data?.getConsumer.name}
          </div>
          <div>
            <Icon.Close onClick={onShowChat} className="w-4 h-4 cursor-pointer fill-current text-white" />
          </div>
          
        </div>
        <Message room_id={widgetdata?.widgetLogin?.rooms[0].id} user_id={widgetdata?.widgetLogin?.id}/>
        <FormMessage room_id={widgetdata?.widgetLogin?.rooms[0].id}/>
      </div>
      <div 
        onClick={onShowChat}
        className={`bg-blue-800 rounded-full w-auto fixed bottom-5 right-5 p-3 cursor-pointer ${isOpen ? 'hidden' : ''}`}>
        <Icon.Chat className="w-10 h-10 fill-current text-white m-auto"/>
      </div>
    </>
  )
}

Widget.defaultProps = {
  access_key: '123',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJlZTJAZW1haWwuY29tIiwiaWF0IjoxNjA3MDU1Mzc5LCJleHAiOjE2MDcxNDE3Nzl9.G4dBJev9Rl8WphPdvhFxlPehcm9KI7Hda05D83FlzSQ'
}

Widget.propTypes = {
  access_key: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
}

export default Widget