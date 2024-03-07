import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import useScreenOrientation from '../hooks/useScreenOrientation'
import { AiOutlineRotateLeft } from 'react-icons/ai'
import { useEffect, useState } from 'react'


const AuthLayout = () => {
    const globalUser = useSelector(state => state.userReducer)
    const locaion = useLocation()
    const orientation = useScreenOrientation();
    const [isMobile, setIsMobile] = useState(false)
    const [showWarning, setShowWarning] = useState(false)

    useEffect(() => {
        setIsMobile(detectMob())
    }, [])


    function detectMob() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];

        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }

    useEffect(() => {
        if (isMobile && orientation !== 0)
            setShowWarning(true)
        else setShowWarning(false)
    }, [isMobile, orientation])

    return (
        !globalUser.isLoggedIn ?
            showWarning ?
                <div className='w-full h-screen flex flex-col gap-2 justify-center items-center'>
                    <AiOutlineRotateLeft size={120} />
                    <p>لطفا گوشی خود را عمودی نگه دارید</p>
                </div>
                :
                <>
                    <Outlet />
                    <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="dark" />
                </>
            : <Navigate to='/mafia/profile' state={{ from: locaion }} replace />
    )
}

export default AuthLayout

