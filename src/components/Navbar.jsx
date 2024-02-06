import React from 'react'
import { NavLink } from 'react-router-dom'
import EventsIcon from '../assets/icons/eventsIcon.svg'
import LearningIcon from '../assets/icons/learningIcon.svg'
import ManageIcon from '../assets/icons/manageIcon.svg'
import ProfileIcon from '../assets/icons/profileIcon.svg'
import EventsActiveIcon from '../assets/icons/eventsActiveIcon.svg'
import LearningActiveIcon from '../assets/icons/learningActiveIcon.svg'
import ManageActiveIcon from '../assets/icons/manageActiveIcon.svg'
import ProfileActiveIcon from '../assets/icons/profileActiveIcon.svg'
import { useSelector } from 'react-redux'
const Navbar = () => {
    const navStyle = 'flex flex-col items-center justify-center gap-1 w-full text-xs text-gray-light mt-2.5 transition-all'
    const activeNavStyle = 'flex flex-col items-center justify-center gap-1 w-full  text-xs pb-2.5 text-secondary transition-all'
    const globalUser = useSelector(state => state.userReducer)

    return (
        <nav className='fixed w-full bottom-0 left-0 py-4 z-20'>
            <ul className='w-full flex justify-evenly'>
                <li>
                    <NavLink
                        to="/mafia/profile"
                        className={({ isActive }) => isActive ? activeNavStyle : navStyle}
                    >
                        {({ isActive }) => (
                            <>
                                <img className='w-6' src={isActive ? ProfileActiveIcon : ProfileIcon} />
                                <span>پروفایل</span>
                            </>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/mafia/learning"
                        className={({ isActive }) => isActive ? activeNavStyle : navStyle}
                    >
                        {({ isActive }) => (
                            <>
                                <img className='w-6' src={isActive ? LearningActiveIcon : LearningIcon} />
                                <span>آموزش</span>
                            </>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/mafia/jamnet"
                        className={({ isActive }) => isActive ? activeNavStyle : navStyle}
                    >
                        {({ isActive }) => (
                            <>
                                <img className='w-6' src={isActive ? ManageActiveIcon : ManageIcon} />
                                <span>جم نت</span>
                            </>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/mafia/events"
                        className={({ isActive }) => isActive ? activeNavStyle : navStyle}
                    >
                        {({ isActive }) => (
                            <>
                                <img className='w-6' src={isActive ? EventsActiveIcon : EventsIcon} />
                                <span>ایونت ها</span>
                            </>
                        )}
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar