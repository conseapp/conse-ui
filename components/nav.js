import React from "react";
import styles from '/styles/components/nav.module.scss'
import Link from "next/link";
import { MdOutlineAddBox, MdOutlineExplore, MdOutlineHome, MdOutlineInfo } from "react-icons/md";
import Image from "next/future/image";

const Nav = props => {
    /**
     * Get all component props
     * @version 1.0
     */
    const { user } = props

    return (
        <nav className={ styles.component }>
            <ul className={ styles.list }>
                <li>
                    <Link href={ Object.keys( user ).length === 0 ? '/login' : '/profile' }>
                        <a>
                            <Image src={ '/avatar-medium.png' } alt={ "User" } width={ 30 } height={ 30 } style={ { borderRadius: '50%' } } />
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href={ '/learn' }>
                        <a>
                            <MdOutlineInfo />
                        </a>
                    </Link>
                </li>
                {
                    user.access_level === 0 || user.access_level === 1 ?
                        <li>
                            <Link href={ '/conductor' }>
                                <a>
                                    <MdOutlineAddBox />
                                </a>
                            </Link>
                        </li> :
                        <></>
                }
                <li>
                    <Link href={ '/events' }>
                        <a>
                            <MdOutlineExplore />
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href={ '/' }>
                        <a>
                            <MdOutlineHome />
                        </a>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Nav