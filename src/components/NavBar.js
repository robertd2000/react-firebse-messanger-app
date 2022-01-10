import { signOut } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import { auth, db } from '../firebase'

export const NavBar = () => {
    const { user } = useContext(AuthContext)
    const history = useNavigate()
    const handleSignOut = async () => {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            isOnline: false
        })
        await signOut(auth)
        history('/login')
    }

    return (
        <nav>
            <h3>
                <Link to='/'>Messanger</Link>
            </h3>
            <div>
                {user ? (
                    <>
                        <Link to='/profile'>Profile</Link>  
                        <button className='btn' onClick={handleSignOut}>Log Out</button>                  
                    </>
                ) : (
                    <>
                        <Link to='/register'>Sign Up</Link>
                        <Link to='/login'>Login</Link> 
                    </>
                ) }
            </div>
        </nav>
    )
}
