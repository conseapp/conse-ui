import styles from "/styles/pages/conductor/event/index.module.scss";
import Link from "next/link";
import { MdAdd, MdEdit } from "react-icons/md";
import * as cookie from "cookie";

const Decks = props => {
    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { events } = props

    return (
        <div className={ styles.page }>

            <Link href={ 'event/create' }>
                <a className={ styles.addButton }>
                    <MdAdd />
                    ایجاد ایونت
                </a>
            </Link>

            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>نام ایونت</th>
                    <th>عملیات</th>
                </tr>
                </thead>
                <tbody>
                { events.map( ( deck, index ) => {
                    return (
                        <tr key={ deck._id.$oid }>
                            <td>{ index + 1 }</td>
                            <td>{ deck.title }</td>
                            <td>
                                <Link href={ `#` }>
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
 * @param context
 * @returns {Promise<{props: {events}}>}
 */
export async function getServerSideProps( context ) {
    const token = cookie.parse( context.req.headers.cookie )
    const user  = JSON.parse( atob( token.access_token ) )

    let events = await fetch( `${ process.env.EVENT_URL }/event/get/all/god`, {
        method:  "GET",
        headers: { "Authorization": `Bearer ${ user.access_token }` }
    } )
    events     = await events.json()

    return {
        props: {
            events: events.data
        }
    }
}

export default Decks