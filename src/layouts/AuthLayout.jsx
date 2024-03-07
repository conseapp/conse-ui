import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import useScreenOrientation from '../hooks/useScreenOrientation'
import { AiOutlineRotateLeft } from 'react-icons/ai'


const AuthLayout = () => {
    const globalUser = useSelector(state => state.userReducer)
    const locaion = useLocation()
    const orientation = useScreenOrientation();

    return (
        !globalUser.isLoggedIn ?
            orientation === 0 ?
                <>
                    <Outlet />
                    <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="dark" />
                </>
                :
                <div className='w-full h-screen flex flex-col gap-2 justify-center items-center'>
                    <AiOutlineRotateLeft size={120} />
                    <p>لطفا گوشی خود را عمودی نگه دارید</p>
                </div>
            : <Navigate to='/mafia/profile' state={{ from: locaion }} replace />
    )
}

export default AuthLayout

