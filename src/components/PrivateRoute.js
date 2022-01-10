import React, { useContext } from 'react'
import { Route, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/auth'

export const PrivateRoute = ({component: Component, ...rest}) => {
    const { user } = useContext(AuthContext)

    if (!user) {
        return  <Navigate to={'/login'} />
    }
    return Component
}
