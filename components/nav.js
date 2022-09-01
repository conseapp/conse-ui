import React from "react";
import styles from '../assets/scss/Nav.module.css'
import Link from "next/link";
import { MdOutlineAddBox, MdOutlineHome } from "react-icons/md";
import Image from "next/image";

class Nav extends React.Component {
    render() {
        return (
            <nav className={ styles.nav }>
                <ul>
                    <li>
                        <Link href={ '#' }>
                            <a>
                                <Image src={ '/avatar-medium.png' } alt={ "User" } width={ 30 } height={ 30 } style={ { borderRadius: '50%' } } />
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
                    <li>
                        <Link href={ '#' }>
                            <a>
                                <MdOutlineAddBox />
                            </a>
                        </Link>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Nav