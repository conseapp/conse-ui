import * as React from 'react';
import styles from "/styles/components/header.module.scss";
import Link from "next/link";
import Image from "next/future/image";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { MdLogout, MdStar } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getuser, logout } from "../redux/actions";
import Circular from './Circular';

const Header = props => {
    const [loading, setLoading] = React.useState(true)
    const dispatch = useDispatch();
    const fetchUser = () => dispatch(getuser());
    React.useEffect(() => {
        fetchUser();
    }, []);

    const { globalUser } = useSelector(state => state.userReducer)
    console.log(globalUser)


    React.useEffect(() => {
        if (globalUser)
            setLoading(false)
    }, [globalUser])

    /**
     * Use next.js router
     * @version 1.0
     */
    const router = useRouter()

    /**
     * Get props of this page
     * @version 1.0
     * @var user
     */
    const { user, profile } = props

    /**
     * The function to log the user out of the user account.
     * This function deletes the relevant cookies.
     * @version 1.0
     * @constructor
     */

    // const Logout = () => {
    //     deleteCookie('token')
    //     router.reload()
    // }

    const handleLogOut = async () => {
        dispatch(logout());
    }


    return (
        <header className={styles.component}>
            {loading ?
                <>
                <Circular />
                </>
                :
                <>

                    <div className={styles.logo}>
                        <Link href={"/"}>
                            <a>
                                <Image src='/logo.png' alt={"Conse"} width={66} height={32} />
                            </a>
                        </Link>
                    </div>

                    {
                        profile === true &&
                        <div className={styles.profile}>
                            {
                                globalUser && !globalUser.isLoggedIn ?

                                    <a href={'/login'} className={styles.loginButton}>ورود به حساب کاربری</a>
                                    :

                                    <>
                                        <Image src='/avatar.png' alt={globalUser.username} width={40} height={40} />

                                        <div className={styles.info}>
                                            <h4>{globalUser.username}</h4>
                                            <div className={styles.score}>
                                                <MdStar />
                                                امتیاز: 0
                                            </div>
                                        </div>

                                        <button className={styles.logout} onClick={handleLogOut}>
                                            <MdLogout />
                                            خروج از حساب
                                        </button>
                                    </>
                            }
                        </div>
                    }
                </>}

        </header>
    )
}

Header.defaultProps = {
    profile: true
}

export default Header