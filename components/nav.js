import React from "react";
import styles from '/styles/components/nav.module.scss'
import Link from "next/link";
import { MdOutlineAddBox, MdOutlineExplore, MdOutlineHome } from "react-icons/md";
import Image from "next/future/image";

const Nav = props => {
    const { user } = props

    return (
        <nav className={ styles.component }>
            <ul>
                <li>
                    <Link href={ '/profile' }>
                        <a>
                            <Image src={ '/avatar-medium.png' } alt={ "User" } width={ 30 } height={ 30 } style={ { borderRadius: '50%' } } />
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href={ '/explore' }>
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
                {
                    user.access_level === 1 || user.access_level === 0 &&
                    <li>
                        <Link href={ '/conductor' }>
                            <a>
                                <MdOutlineAddBox />
                            </a>
                        </Link>
                    </li>
                }
            </ul>
        </nav>
    )
}

export default Nav