import React from 'react'
import { Link } from 'react-router-dom'

const Landing = () => {
    return (
        <div className='text-3xl'>
            <Link to={'/mafia/profile'}>ورود به اپلیکیشن</Link>
        </div>
    )
}

export default Landing