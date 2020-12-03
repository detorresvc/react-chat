import { useQuery, gql } from 'graphql/client';

const MESSAGES = gql`
query showImage($id:ID!){
  viewImage(id:$id)
}
`;

function PlaceHolderAttachment(props){

  const { data: { viewImage } = '', loading } = useQuery(MESSAGES, {
    variables: {
      id: props.id
    }
  })
  
  if(loading){
    return 'loading...'
  }

  if(/image/g.test(props.mimetype)){
    return (
      <img className="w-20" src={`data:${props.mimetype};base64, ${viewImage}`}/>
    )  
  }

  if(/video/g.test(props.mimetype)){
    return (
      <video className="w-64" controls>
        <source type={props.mimetype} src={`data:${props.mimetype};base64, ${viewImage}`}/>
        <source type='video/mp4' src={`data:${props.mimetype};base64, ${viewImage}`}/>
      </video>
    )  
  }
}

export default PlaceHolderAttachment