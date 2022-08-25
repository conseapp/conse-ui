import React, { useEffect, useState } from "react";
import styles from '../assets/scss/Header.module.css'
import Image from "next/image";
import { MdLogout, MdStar } from "react-icons/md";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = props => {
    const router = useRouter()

    const [ name, setName ]   = useState( '' )
    const [ score, setScore ] = useState( 0 )

    let username = getCookie( 'username' ) // Get username

    useEffect( () => setName( username ), [ username ] )

    useEffect( () => setScore( 300 ), [] )

    const logout = () => {
        deleteCookie( '_id' )
        deleteCookie( 'access_token' )
        deleteCookie( 'username' )

        setTimeout( () => router.push( '/auth/login' ), 2000 )
    }

    return (
        <header className={ styles.section }>
            <div className={ styles.logo }>
                <Link href={ "/home" }>
                    <a>
                        <Image src={ '/logo.png' } alt={ "Conse" } width={ 66 } height={ 32 } />
                    </a>
                </Link>
            </div>
            { props.showProfile && (
                <div className={ styles.profile }>
                    <div className={ styles.avatar }>
                        { /* eslint-disable-next-line @next/next/no-img-element */ }
                        <img src={ '/avatar-medium.png' } alt={ "User" } width={ 35 } height={ 35 } />
                    </div>
                    <div className={ styles.info }>
                        <div className={ styles.name }>{ name }</div>
                        <div className={ styles.score }>
                            <MdStar />
                            { score } امتیاز
                        </div>
                    </div>
                    <button type={ "button" } onClick={ logout } className={ styles.logoutButton }>
                        <MdLogout />
                        خروج
                    </button>
                </div>
            ) }
        </header>
    )
}

Header.defaultProps = { showProfile: true }

export default Header