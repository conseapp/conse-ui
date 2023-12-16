import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Navbar from '../components/Navbar'


const MainLayout = () => {
    const globalUser = useSelector(state => state.userReducer)
    const locaion = useLocation()

    return (
        globalUser.isLoggedIn ?
            <div className='flex justify-center items-center font-sans min-h-screen relative px-4 py-[88px]'>
                <Header />
                <Outlet />
                <Navbar />
            </div> : <Navigate to='/mafia/login' state={{ from: locaion }} replace />
    )
}

export default MainLayout

