import React, { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db, auth} from '../firebase'
import { User } from '../components/User'

export const Home = () => {
    const [users, setUsers] = useState([])
    const [chat, setChat] = useState('')
    useEffect(() => {
        const userRef = collection(db, 'users')
        const q = query(userRef, where('uid', 'not-in', [auth.currentUser.uid]))
        const unsub = onSnapshot(q, snapshot => {
            const usersArr = []
            snapshot.forEach(doc => {
                usersArr.push(doc.data())
            })
            setUsers(usersArr)
        })
        return () => unsub()
    }, [])

    const selectUser = (user) => {
        setChat(user)
    }
    
    return (
        <div className='home_container'>
            <div className='users_container'>
                {
                    users.map(user => {

                       return <User key={user.uid} user={user} selectUser={selectUser} />
                    })
                }
            </div>
            <div className='messages_container'>
                {
                    chat ? (<div className='messages_user'>
                        <h3>{chat.name}</h3>
                    </div>) : <h3 className='no_conv'>Select user</h3>
                }
            </div>
        </div>
    )
}
