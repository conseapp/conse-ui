import styles from "/styles/components/header.module.scss";
import sidebar from "/styles/components/sidebar.module.scss";
import Link from "next/link";
import Image from "next/future/image";
import { MdLogout, MdStar } from "react-icons/md";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";

const Header = ( props ) => {
    const Router = useRouter()

    const { user } = props

    const ToggleSidebar = () => {
        document.querySelector( `.${ sidebar.component }` ).classList.add( sidebar.show )
    }

    const Logout = () => {
        deleteCookie( 'access_token' )
        Router.push( '/' )
    }

    return (
        <header className={ styles.component }>

            {/*<button type={ "button" } onClick={ ToggleSidebar } className={ styles.toggleMenu }>*/ }
            {/*    <MdMenu />*/ }
            {/*</button>*/ }

            <div className={ styles.logo }>
                <Link href={ "/" }>
                    <a>
                        <Image src={ '/logo.png' } alt={ "Conse" } width={ 66 } height={ 32 } />
                    </a>
                </Link>
            </div>

            <div className={ styles.profile }>
                <Image src={ '/avatar.png' } alt={ user.username } width={ 40 } height={ 40 } />

                <div className={ styles.info }>
                    <h4>{ user.username }</h4>
                    <div className={ styles.score }>
                        <MdStar />
                        امتیاز: 1405
                    </div>
                </div>

                <button className={ styles.logout } onClick={ Logout }>
                    <MdLogout />
                    خروج از حساب
                </button>

            </div>

        </header>
    )
}

export default Header