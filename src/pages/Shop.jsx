import React from 'react'
import { RegularButton } from '../components/ui/buttons'
import dorehamiLogo from '../assets/dorehamilogo.png'

const Shop = () => {

    const goToShop = () => { 
        window.open('https://dorehamigames.com/')
     }
  return (
    <div className='h-custom-screen flex flex-col items-center justify-center gap-12'>
        <img src={dorehamiLogo} alt="dorehami-logo" />
        <div className='w-full max-w-[600px]'>
        <RegularButton text={"ورود به فروشگاه"} onClick={goToShop}/>
        </div>
    </div>
  )
}

export default Shop