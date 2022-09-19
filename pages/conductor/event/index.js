import styles from "/styles/pages/conductor/event/index.module.scss";
import Link from "next/link";
import { MdAdd, MdEdit } from "react-icons/md";
import Head from "next/head";
import Header from "../../../components/header";
import checkToken from "../../../utils/checkToken";
import Nav from "../../../components/nav";

const Decks = props => {
    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { user, events } = props

    return (
        <div className={ styles.page }>

            <Head>
                <title>ایونت های شما</title>
            </Head>

            <Header user={ user } />

            <Nav user={ user } />

            <div className="container">

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
                    { events.map( ( event, index ) => {
                        return (
                            <tr key={ event._id.$oid }>
                                <td>{ index + 1 }</td>
                                <td>{ event.title }</td>
                                <td>
                                    <Link href={ `/conductor/event/${ event._id.$oid }` }>
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
 * @param context
 * @returns {Promise<{props: {events}}>}
 */
export async function getServerSideProps( context ) {
    // Check user
    let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

    let events = await fetch( `${ process.env.EVENT_URL }/event/get/all/god`, {
        method:  "GET",
        headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
    } )
    events     = await events.json()

    return {
        props: {
            user:   user,
            events: events.data
        }
    }
}

export default Decks