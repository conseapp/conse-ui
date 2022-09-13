import styles from '/styles/pages/conductor/index.module.scss'
import Link from "next/link";
import { MdEvent } from "react-icons/md";
import { GiCardRandom } from "react-icons/gi";
import Head from "next/head";
import checkToken from "../../utils/checkToken";
import Header from "../../components/header";
import Nav from "../../components/nav";

const Conductor = props => {
    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { user } = props

    return (
        <div className={ styles.page }>

            <Head>
                <title>کنسه</title>
            </Head>

            <Header user={ user } />

            <div className="container">
                <ul className={ styles.list }>
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

            <Nav user={ user } />

        </div>
    )
}

export async function getServerSideProps( context ) {
    // Check user
    let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

    return {
        props: {
            user: user
        }
    }
}

export default Conductor