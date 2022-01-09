import React from 'react'
import { Link } from 'react-router-dom'

export const NavBar = () => {
    return (
        <nav>
            <h3>
                <Link to='/'>Messanger</Link>
            </h3>
            <div>
                <Link to='/register'>Sign Up</Link>
                <Link to='/login'>Login</Link>
            </div>
        </nav>
    )
}
