import React from "react";
import styles from '../assets/scss/Nav.module.css'
import Link from "next/link";
import {MdOutlineAddBox, MdOutlineExplore, MdOutlineHome, MdOutlineMenu} from "react-icons/md";
import Image from "next/image";

class Nav extends React.Component {
    render() {
        return (
            <nav className={styles.nav}>
                <ul>
                    <li>
                        <Link href={'/dashboard'}>
                            <a>
                                <Image src={'/avatar-small.png'} alt={"User"} width={30} height={30}/>
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/event/explore'}>
                            <a>
                                <MdOutlineExplore/>
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/home'}>
                            <a>
                                <MdOutlineHome/>
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/event/add'}>
                            <a>
                                <MdOutlineAddBox/>
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href={'#'}>
                            <a>
                                <MdOutlineMenu/>
                            </a>
                        </Link>
                    </li>
                </ul>
            </nav>
        )
    }
}

export default Nav