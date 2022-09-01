import styles from "/styles/components/header.module.scss";
import sidebar from "/styles/components/sidebar.module.scss";
import Link from "next/link";
import Image from "next/future/image";
import { MdMenu } from "react-icons/md";

const Header = ( props ) => {
    const { user } = props

    const ToggleSidebar = () => {
        document.querySelector( `.${ sidebar.component }` ).classList.add( sidebar.show )
    }

    return (
        <header className={ styles.component }>

            <button type={ "button" } onClick={ ToggleSidebar } className={ styles.toggleMenu }>
                <MdMenu />
            </button>

            <div className={ styles.logo }>
                <Link href={ "/" }>
                    <a>
                        <Image src={ '/logo.png' } alt={ "Conse" } width={ 66 } height={ 32 } />
                    </a>
                </Link>
            </div>

        </header>
    )
}

export default Header