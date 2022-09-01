import styles from '/styles/components/sidebar.module.scss';
import Image from "next/future/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MdEdit, MdEmojiEvents, MdEvent, MdHome, MdLogout, MdOutlineEvent, MdOutlineGroups } from "react-icons/md";
import { GiCardRandom } from "react-icons/gi";

const Sidebar = props => {
    const { user } = props

    const [ Level, SetLevel ] = useState( 'بازیکن' )
    useEffect( () => {
        switch ( user.access_level ) {
            case 0:
                SetLevel( 'توسعه دهنده' )
                break;
            case 1:
                SetLevel( 'گرداننده' )
                break;
        }
    }, [ user.access_level ] )

    const HideSidebar = () => document.querySelector( `.${ styles.component }` ).classList.remove( styles.show )

    return (
        <aside className={ styles.component }>

            <div className={ styles.overlay } onClick={ HideSidebar }></div>

            <div className={ styles.drawer }>

                <div className={ styles.profile }>
                    <Image src={ '/avatar.png' } alt={ user.username } width={ 120 } height={ 120 } draggable={ false } />

                    <div className={ styles.name }>
                        <strong>{ user.username }</strong>
                        <span className={ styles.badge }>{ Level }</span>
                    </div>

                </div>

                <div className={ styles.score }>
                    <ul>
                        <li>
                            <p>4689</p>
                            <p>امتیاز</p>
                            <MdEmojiEvents />
                        </li>
                        <li>
                            <p>123</p>
                            <p>تعداد بازی ها</p>
                            <MdOutlineEvent />
                        </li>
                    </ul>
                </div>

                <Link href={ "/profile/edit" }>
                    <a className={ `${ styles.editProfile } ${ styles.link }` }>
                        <MdEdit />
                        ویرایش پروفایل
                    </a>
                </Link>

                <Link href={ "/auth/logout" }>
                    <a className={ `${ styles.logout } ${ styles.link }` }>
                        <MdLogout />
                        خروج از حساب کاربری
                    </a>
                </Link>

                {
                    user.access_level === 1 || user.access_level === 0 &&
                    <div className={ styles.menu }>
                        <header>فهرست گرداننده</header>
                        <ul>
                            <li>
                                <Link href={ '/conductor/group' }>
                                    <a>
                                        <MdOutlineGroups />
                                        گروه های شما
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={ '/conductor/deck' }>
                                    <a>
                                        <GiCardRandom />
                                        دک های شما
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={ '/conductor/event' }>
                                    <a>
                                        <MdEvent />
                                        ایونت های شما
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                }

                <div className={ styles.menu }>
                    <header>فهرست</header>
                    <ul>
                        <li>
                            <Link href={ '/' }>
                                <a>
                                    <MdHome />
                                    صفحه اصلی
                                </a>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className={ styles.copyRight }>
                    From IA
                </div>
            </div>

        </aside>
    )
}

export default Sidebar