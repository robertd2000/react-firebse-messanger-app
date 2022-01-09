import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { useNavigate} from 'react-router-dom'

export const Login = () => {
    const [data, setData] = useState({
        email: '',
        password: '',
        error: null,
        loading: false
    })

    const history = useNavigate()

    const { email, password, error, loading} = data

    const handleChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const submitHandle = async (e) => {
        e.preventDefault()
        setData({
            ...data,
            error: null,
            loading: true
        })
        if (!email || !password) {
            setData({
                ...data,
                error: 'All fields are required!'
            })
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password)
            await updateDoc(doc(db, 'users', result.user.uid), {
                isOnline: true
            })
            setData({
                email: '',
                password: '',
                error: null,
                loading: false
            })
            history('/')
        } catch (error) {
            setData({
                ...data,
                error: error.message,
                loading: false
            })
        }
    }

    return (
        <section>
            <h3>Log In With Email</h3>
            <form className='form' onSubmit={submitHandle}>
                <div className='input_container'>
                    <label htmlFor='email'>Email</label>
                    <input 
                        type={'text'} 
                        name='email'
                        value={email}
                        onChange={handleChange} />
                </div>
                <div className='input_container'>
                    <label htmlFor='password'>Password</label>
                    <input 
                        type={'password'} 
                        name='password'
                        value={password}
                        onChange={handleChange} />
                </div>
                {error ? <p className='error'>{error}</p> : null}
                <div className='btn_container'>
                    <button className='btn' disabled={loading}>{
                        !loading ? 'Log In' : 'Loggin in...'
                    }</button>
                </div>
            </form>
        </section>
    )
}
