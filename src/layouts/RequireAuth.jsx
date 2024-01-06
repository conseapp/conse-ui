import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RequireAuth = ({ allowedRoles }) => {
    const globalUser = useSelector(state => state.userReducer)
    const locaion = useLocation()

    return (
        allowedRoles?.includes(globalUser.accessLevel)
            ? <Outlet />
            : <Navigate to='/mafia/unauthorized' state={{ from: locaion }} replace />
    )
}

export default RequireAuth