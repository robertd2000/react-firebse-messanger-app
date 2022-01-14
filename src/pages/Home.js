import React, { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
} from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { db, auth, storage } from '../firebase'
import { User } from '../components/User'
import { MessageForm } from '../components/MessageForm'

export const Home = () => {
  const [users, setUsers] = useState([])
  const [chat, setChat] = useState('')
  const [text, setText] = useState('')
  const [img, setImg] = useState('')

  const user1 = auth.currentUser.uid

  useEffect(() => {
    const userRef = collection(db, 'users')
    const q = query(userRef, where('uid', 'not-in', [auth.currentUser.uid]))
    const unsub = onSnapshot(q, (snapshot) => {
      const usersArr = []
      snapshot.forEach((doc) => {
        usersArr.push(doc.data())
      })
      setUsers(usersArr)
    })
    return () => unsub()
  }, [])

  const selectUser = (user) => {
    setChat(user)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const user2 = chat.uid

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

    let url

    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      )
      const snap = await uploadBytes(imgRef, img)
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath))
      url = dlUrl
    }

    await addDoc(collection(db, 'messages', id, 'chat'), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || '',
    })
    setText('')
  }

  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => {
          return <User key={user.uid} user={user} selectUser={selectUser} />
        })}
      </div>
      <div className="messages_container">
        {chat ? (
          <>
            <div className="messages_user">
              <h3>{chat.name}</h3>
            </div>
            <MessageForm
              text={text}
              setText={setText}
              setImg={setImg}
              handleSubmit={handleSubmit}
            />
          </>
        ) : (
          <h3 className="no_conv">Select user</h3>
        )}
      </div>
    </div>
  )
}
