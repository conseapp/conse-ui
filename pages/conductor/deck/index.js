import styles from "/styles/pages/conductor/deck/index.module.scss";
import Link from "next/link";
import { MdAdd, MdEdit } from "react-icons/md";
import * as cookie from "cookie";

const Decks = props => {
    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { decks } = props

    return (
        <div className={ styles.page }>

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
                                <Link href={ '#' }>
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
    )
}

/**
 *
 * @link https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
 * @param context
 * @returns {Promise<{props: {roles: *, sides: *, user: any}}>}
 */
export async function getServerSideProps( context ) {
    const token = cookie.parse( context.req.headers.cookie )
    const user  = JSON.parse( atob( token.access_token ) )

    // Set request options
    const options = {
        method:   'GET',
        headers:  { "Authorization": `Bearer ${ user.access_token }` },
        redirect: 'follow'
    }

    // Get available decks
    let decks = await fetch( `${ process.env.GAME_URL }/game/deck/get/availables`, options )
    decks     = await decks.json()

    return {
        props: {
            decks: decks.data.decks
        }
    }
}

export default Decks