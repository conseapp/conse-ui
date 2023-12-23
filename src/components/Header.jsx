import React, { useEffect } from 'react'
import { IoStar } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { GoBackButton } from './ui/buttons';
import { useSelector } from 'react-redux';

const Header = () => {
  const globalUser = useSelector(state => state.userReducer)
  const location = useLocation();
  const from = location.state?.from
  const navigate = useNavigate()

  const backPageName = () => {
    const previousPageName = ''
    if (from == '/mafia/profile') {
      return 'پروفایل'
    }
    if (from == '/mafia/manage') {
      return 'مدیریت بازی'
    }
    if (from == '/mafia/manage/events') {
      return 'مدیریت ایونت‌ها'
    }
    return previousPageName
  }



  return (
    <header className='flex w-full fixed justify-between top-0 left-0 p-4 box-border'>
      <div className='flex flex-col gap-2 justify-center'>
        {
          location.state?.backButton ?
            <GoBackButton onClick={() => location.state?.goToFrom ? navigate(from) : navigate(-1)} text={backPageName()} />
            :
            <>
              <span>{globalUser.username}</span>
              <span className='flex gap-1.5 text-sm'>
                <IoStar color='#FFB800' size={18} />
                امتیاز :
                0
              </span>
            </>
        }
      </div>
      <div className='inline-block rounded-full p-[1px] bg-gradient-to-br from-primary-light from-30% to-gray to-95% drop-shadow-neon'>
        <div className='w-14 h-14 rounded-full bg-gray'></div>
      </div>
      {/* <div>{JSON.stringify(location)}</div> */}
    </header>
  )
}

export default Header