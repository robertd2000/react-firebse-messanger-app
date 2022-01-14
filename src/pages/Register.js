import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

export const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    error: null,
    loading: false,
  })

  const history = useNavigate()

  const { name, email, password, error, loading } = data

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    })
  }

  const submitHandle = async (e) => {
    e.preventDefault()
    setData({
      ...data,
      error: null,
      loading: true,
    })
    if (!name || !email || !password) {
      setData({
        ...data,
        error: 'All fields are required!',
      })
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      })
      setData({
        name: '',
        email: '',
        password: '',
        error: null,
        loading: false,
      })
      history('/')
    } catch (error) {
      setData({
        ...data,
        error: error.message,
        loading: false,
      })
    }
  }

  return (
    <section>
      <h3>Create An Account</h3>
      <form className="form" onSubmit={submitHandle}>
        <div className="input_container">
          <label htmlFor="name">Name</label>
          <input
            type={'text'}
            name="name"
            value={name}
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label htmlFor="email">Email</label>
          <input
            type={'text'}
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label htmlFor="password">Password</label>
          <input
            type={'password'}
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="btn_container">
          <button className="btn" disabled={loading}>
            {!loading ? 'Register' : 'Creating'}
          </button>
        </div>
      </form>
    </section>
  )
}
