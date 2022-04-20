import React from 'react'

const Message = ({setName}) => {


  return (
    <div>
      <button onClick={() => setName('Hello World')}>Click</button> 
    </div>
  )
}

export default Message