import styles from "/styles/pages/conductor/event/index.module.scss";
import Link from "next/link";
import { MdAdd, MdEdit } from "react-icons/md";

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
 * @link https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
 * @returns {Promise<{props: {roles: *, sides: *, user: any}}>}
 */
export async function getServerSideProps() {
    let decks = await fetch( `${ process.env.EVENT_URL }/event/get/all` )
    decks     = await decks.json()

    return {
        props: {
            events: decks.data.events
        }
    }
}

export default Decks