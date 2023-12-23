import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import { ToastContainer } from 'react-toastify'


const MainLayout = () => {
    const globalUser = useSelector(state => state.userReducer)
    const locaion = useLocation()

    return (
        globalUser.isLoggedIn ?
            <div className='overflow-hidden font-sans min-h-screen relative px-4 py-[88px]'>
                <Header />
                <Outlet />
                <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="dark" />
                <Navbar />
            </div> : <Navigate to='/mafia/login' state={{ from: locaion }} replace />
    )
}

export default MainLayout

