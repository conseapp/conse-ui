import React, { useEffect, useState } from "react";
import styles from '/styles/components/nav.module.scss'
import Link from "next/link";
import { MdOutlineAddBox, MdOutlineExplore, MdOutlineHome, MdOutlineInfo } from "react-icons/md";
import Image from "next/future/image";
import { useDispatch, useSelector } from "react-redux";
import { getuser } from "../redux/actions";
import Circular from "./Circular";
import { useRouter } from "next/router";

const Nav = props => {
    const { pathname } = useRouter()
    const [loading, setLoading] = useState(true)
    // const dispatch = useDispatch();
    // const fetchUser = () => dispatch(getuser());
    // React.useEffect(() => {
    //     fetchUser();
    // }, []);

    const { globalUser } = useSelector(state => state.userReducer)
    console.log(globalUser)


    // let globalUser
    /**
     * Get all component props
     * @version 1.0
     */
    const { user } = props


    useEffect(() => {
        console.log("im here",pathname );
        if (globalUser)
            setLoading(false)
    }, [globalUser])
    return (
        <nav className={styles.component}>
            {loading ? <><Circular /></> :
                <ul className={styles.list}>
                    <li className={pathname.includes('/profile') ? styles.active : ''}>
                        {globalUser && globalUser.isLoggedIn ?
                            <Link href={'/profile'}>
                                <a>
                                    <Image src='/avatar.png' alt={"User"} width={30} height={30} style={{ borderRadius: '50%' }} />
                                </a>
                            </Link>
                            :
                            <a href={'/login'}>
                                <Image src='/avatar.png' alt={"User"} width={30} height={30} style={{ borderRadius: '50%' }} />
                            </a>

                        }
                    </li>
                    <li className={pathname.includes('/learn') ? styles.active : ''}>
                        {globalUser && globalUser.isLoggedIn ?
                            <Link href={'/learn'}>
                                <a>
                                    <MdOutlineInfo />
                                </a>
                            </Link>
                            :
                            <a href={'/login'}>
                                <MdOutlineInfo />
                            </a>
                        }
                    </li>
                    {
                        globalUser.access_level === 0 || globalUser.access_level === 1 ?
                            <li className={pathname.includes('/conductor') ? styles.active : ''}>
                                <Link href={'/conductor'}>
                                    <a>
                                        <MdOutlineAddBox />
                                    </a>
                                </Link>
                            </li> :
                            <></>
                    }
                    <li className={pathname.includes('/events') ? styles.active : ''}>
                        <Link href={'/events'}>
                            <a>
                                <MdOutlineExplore />
                            </a>
                        </Link>
                    </li>
                    {
                    ((globalUser.access_level !== 1 && globalUser.access_level !== 0 )) ?
                    <li className={pathname === '/' ? styles.active : ''}>
                        <Link href={'/'}>
                            <a>
                                <MdOutlineHome />
                            </a>
                        </Link>
                    </li>
                    :
                    <></>
                    }
                </ul>
            }
        </nav>
    )
}

export default Nav