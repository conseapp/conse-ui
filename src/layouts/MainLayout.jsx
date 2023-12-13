import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Navbar from '../components/Navbar'


const MainLayout = () => {
    return (
        <div className='flex justify-center items-center font-sans min-h-screen bg-gradient-main relative px-4 py-[88px]'>
            <Header />
            <Outlet />
            <Navbar/>
        </div>
    )
}

export default MainLayout

