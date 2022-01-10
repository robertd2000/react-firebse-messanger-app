import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/auth'

export const PrivateRoute = ({children}) => {
    const { user } = useContext(AuthContext)

    console.log(children);
    if (!user) {
        return  <Navigate to={'/login'} />
    }
    return children
}
