import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import { ToastContainer } from 'react-toastify'
import useScreenOrientation from '../hooks/useScreenOrientation'
import { useEffect } from 'react'
import { AiOutlineRotateLeft } from "react-icons/ai";


const MainLayout = () => {
    const globalUser = useSelector(state => state.userReducer)
    const orientation = useScreenOrientation();
    const locaion = useLocation()

    return (
        globalUser.isLoggedIn ?
            orientation === 0 ?
                <div className='overflow-hidden font-sans min-h-screen relative px-4 py-[88px]'>
                    <Header />
                    <Outlet />
                    <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="dark" />
                    <Navbar />
                </div>
                :
                <div className='w-full h-screen flex flex-col gap-2 justify-center items-center'>
                    <AiOutlineRotateLeft size={120} />
                    <p>لطفا گوشی خود را عمودی نگه دارید</p>
                </div>
            : <Navigate to='/mafia/login' state={{ from: locaion }} replace />

    )
}

export default MainLayout

