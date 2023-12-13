import React from 'react'
import { IoStar } from "react-icons/io5";

const Header = () => {
  return (
    <header className='flex w-full fixed justify-between top-0 left-0 p-4 box-border'>
      <div className='flex flex-col gap-2 justify-center'>
        <span>Javadhosseini</span>
        <span className='flex gap-1.5 text-sm'>
          <IoStar color='#FFB800' size={18} />
          امتیاز :
          0
        </span>
      </div>
      <div className='rounded-full p-[1px] bg-gradient-to-br from-primary-light from-30% to-gray to-95% drop-shadow-neon'>
        <div className='w-14 h-14 rounded-full bg-gray'></div>
      </div>
    </header>
  )
}

export default Header