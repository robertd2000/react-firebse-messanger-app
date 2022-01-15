import React, { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { db, auth, storage } from '../firebase'
import { User } from '../components/User'
import { MessageForm } from '../components/MessageForm'
import { Message } from '../components/Message'

export const Home = () => {
  const [users, setUsers] = useState([])
  const [chat, setChat] = useState('')
  const [text, setText] = useState('')
  const [img, setImg] = useState('')
  const [messages, setMessages] = useState([])

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

  const selectUser = async (user) => {
    setChat(user)

    const user2 = user.uid
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`

    const msgs = collection(db, 'messages', id, 'chat')
    const q = query(msgs, orderBy('createdAt', 'asc'))

    onSnapshot(q, (querySnapshot) => {
      let msg = []
      querySnapshot.forEach((doc) => {
        msg.push(doc.data())
      })
      setMessages(msg)
    })

    const docSnap = await getDoc(doc(db, 'lastMsg', id))
    if (docSnap.data() && docSnap.data().from !== user1) {
      await updateDoc(doc(db, 'lastMsg', id), {
        unread: false,
      })
    }
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

    await setDoc(doc(db, 'lastMsg', id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || '',
      unread: true,
    })
    setText('')
  }

  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => {
          return (
            <User
              key={user.uid}
              user={user}
              selectUser={selectUser}
              user1={user1}
              chat={chat}
            />
          )
        })}
      </div>
      <div className="messages_container">
        {chat ? (
          <>
            <div className="messages_user">
              <h3>{chat.name}</h3>
            </div>
            <div className="messages">
              {messages.length
                ? messages.map((item, i) => {
                    return <Message key={i} msg={item} user1={user1} />
                  })
                : ''}
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
