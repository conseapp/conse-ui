import styles from '/styles/pages/conductor/index.module.scss'
import Link from "next/link";
import { MdEvent } from "react-icons/md";
import { GiCardRandom } from "react-icons/gi";
import Head from "next/head";
import checkToken from "../../../utils/checkToken";
import Header from "../../../components/header";
import Nav from "../../../components/nav";
import { useSelector } from 'react-redux';

const Conductor = props => {
    /**
     * Get all props of this page.
     * @version 1.0
     */
    // const { user } = props
    const { globalUser } = useSelector(state => state.userReducer)
    let user = (globalUser && globalUser.accessToken) ? checkToken(globalUser.accessToken) : {}


    return (
        <div className={styles.page}>

            <Head>
                <title>کنسه</title>
            </Head>

            <Header user={globalUser} />
            {globalUser.isLoggedIn ? <>
                {globalUser.access_level == 0 || globalUser.access_level == 1 ?
                    <div className="container">
                        <ul className={styles.list}>
                            <li>
                                <Link href={'/mafia/conductor/deck'}>
                                    <a>
                                        <GiCardRandom />
                                        دک های شما
                                    </a>
                                </Link>
                            </li>
                            <li>
                            <Link href={'/mafia/conductor/deck/create'}>
                                <a>
                                    <GiCardRandom />
                                    ایجاد دک
                                </a>
                            </Link>
                            </li>
                            <li>
                                <Link href={'/mafia/conductor/event'}>
                                    <a>
                                        <MdEvent />
                                        ایونت های شما
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={'/mafia/conductor/event/create'}>
                                    <a>
                                        <MdEvent />
                                        ایجاد ایونت
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div> :
                    <div className="container">
                        سطح دسترسی ندارید
                    </div>}
            </> : undefined}
            <Nav user={globalUser} />

        </div>
    )
}

// export async function getServerSideProps( context ) {
//     // Check user
//     let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

//     return {
//         props: {
//             user: user
//         }
//     }
// }

export default Conductor