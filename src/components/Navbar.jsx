import React from 'react'
import { NavLink } from 'react-router-dom'
import EventsIcon from '../../public/icons/eventsIcon.svg'
import LearningIcon from '../../public/icons/learningIcon.svg'
import ManageIcon from '../../public/icons/manageIcon.svg'
import ProfileIcon from '../../public/icons/profileIcon.svg'
import EventsActiveIcon from '../../public/icons/eventsActiveIcon.svg'
import LearningActiveIcon from '../../public/icons/learningActiveIcon.svg'
import ManageActiveIcon from '../../public/icons/manageActiveIcon.svg'
import ProfileActiveIcon from '../../public/icons/profileActiveIcon.svg'
const Navbar = () => {
    const TodoStyle = 'flex flex-col items-center justify-center gap-1 w-full text-xs text-gray-light mt-2.5 transition-all'
    const activeTodoStyle = 'flex flex-col items-center justify-center gap-1 w-full  text-xs pb-2.5 text-secondary transition-all'

    return (
        <nav className='fixed w-full bottom-0 left-0 py-4'>
            <ul className='w-full flex justify-evenly'>
                <li>
                    <NavLink
                        to="/mafia/profile"
                        className={({ isActive }) => isActive ? activeTodoStyle : TodoStyle}
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
                        className={({ isActive }) => isActive ? activeTodoStyle : TodoStyle}
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
                        to="/mafia/manage"
                        className={({ isActive }) => isActive ? activeTodoStyle : TodoStyle}
                    >
                        {({ isActive }) => (
                            <>
                                <img className='w-6' src={isActive ? ManageActiveIcon : ManageIcon} />
                                <span>مدیریت بازی</span>
                            </>
                        )}
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/mafia/events"
                        className={({ isActive }) => isActive ? activeTodoStyle : TodoStyle}
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