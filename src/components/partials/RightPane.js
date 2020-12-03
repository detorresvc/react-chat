function RightPane(props){
  return (
    <div className="flex-1 h-screen min-h-screen flex flex-col">
      {props.children}
    </div>
  )
}

export default RightPane