import styles from "/styles/pages/conductor/deck/index.module.scss";
import Link from "next/link";
import { MdAdd, MdEdit } from "react-icons/md";
import checkToken from "../../../utils/checkToken";
import Head from "next/head";
import Header from "../../../components/header";
import Nav from "../../../components/nav";

const Decks = props => {
    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { user, decks } = props

    return (
        <div className={ styles.page }>

            <Head>
                <title>دک های شما</title>
            </Head>

            <Header user={ user } />

            <Nav user={ user } />

            <div className="container">

                <Link href={ 'deck/create' }>
                    <a className={ styles.addButton }>
                        <MdAdd />
                        ایجاد دک
                    </a>
                </Link>

                <table className={ styles.tableOfContent }>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>نام دک</th>
                        <th>عملیات</th>
                    </tr>
                    </thead>
                    <tbody>
                    { decks.map( ( deck, index ) => {
                        return (
                            <tr key={ deck._id.$oid }>
                                <td>{ index + 1 }</td>
                                <td>{ deck.deck_name }</td>
                                <td>
                                    <Link href={ `/conductor/deck/${ deck._id.$oid }` }>
                                        <a>
                                            <MdEdit />
                                        </a>
                                    </Link>
                                </td>
                            </tr>
                        )
                    } ) }
                    </tbody>
                </table>

            </div>

        </div>
    )
}

/**
 *
 * @link https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
 * @param context
 * @returns {Promise<{props: {roles: *, sides: *, user: any}}>}
 */
export async function getServerSideProps( context ) {
    // Check user
    let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

    // Get available decks
    let decks = await fetch( `${ process.env.GAME_URL }/game/deck/get/availables`, {
        method:  'GET',
        headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
    } )
    decks     = await decks.json()

    return {
        props: {
            user:  user,
            decks: decks.data.decks
        }
    }
}

export default Decks