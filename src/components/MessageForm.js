import React from 'react'
import Attachment from './svg/Attachment'

export const MessageForm = ({ text, setText, setImg, handleSubmit }) => {
  return (
    <form className="message_form" onSubmit={handleSubmit}>
      <label htmlFor="img">
        <Attachment />
      </label>
      <input
        type="file"
        id="img"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => setImg(e.target.files[0])}
      />
      <div>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button className="btn">Send</button>
      </div>
    </form>
  )
}
