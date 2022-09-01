import styles from "/styles/pages/conductor/event/index.module.scss";
import Link from "next/link";
import { MdAdd, MdEdit } from "react-icons/md";

const Decks = props => {
    return (
        <div className={ styles.page }>

            <Link href={ 'event/create' }>
                <a className={ styles.addButton }>
                    <MdAdd />
                    ایجاد ایونت
                </a>
            </Link>

            <table className={ styles.tableOfContent }>
                <thead>
                <tr>
                    <th>#</th>
                    <th>نام ایونت</th>
                    <th>عملیات</th>
                </tr>
                </thead>
                <tbody>
                {
                    props.events.map( ( deck, index ) => {
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
                    } )
                }
                </tbody>
            </table>

        </div>
    )
}

export async function getServerSideProps( context ) {
    const options = {
        method:   'GET',
        redirect: 'follow'
    };

    const AvailableDecks = await fetch( `${ process.env.EVENT_URL }/event/get/all`, options )
    const Decks          = await AvailableDecks.json()

    return {
        props: {
            events: Decks.data.events
        }
    }
}

export default Decks