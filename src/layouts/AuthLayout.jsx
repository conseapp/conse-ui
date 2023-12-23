import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'


const AuthLayout = () => {
    const globalUser = useSelector(state => state.userReducer)
    const locaion = useLocation()

    return (
        !globalUser.isLoggedIn ?
            <>
                <Outlet />
                <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            </>
            : <Navigate to='/mafia/profile' state={{ from: locaion }} replace />
    )
}

export default AuthLayout

