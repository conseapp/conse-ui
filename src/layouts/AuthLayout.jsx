import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'


const AuthLayout = () => {
    const globalUser = useSelector(state => state.userReducer)
    const locaion = useLocation()

    return (
        !globalUser.isLoggedIn ?
            <Outlet />
            : <Navigate to='/mafia/profile' state={{ from: locaion }} replace />
    )
}

export default AuthLayout

