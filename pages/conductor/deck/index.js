import styles from "/styles/pages/conductor/deck/index.module.scss";
import Link from "next/link";
import { MdAdd, MdEdit } from "react-icons/md";
import * as cookie from "cookie";

const Decks = props => {
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
                {
                    props.decks.map( ( deck, index ) => {
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
                    } )
                }
                </tbody>
            </table>

        </div>
    )
}

export async function getServerSideProps( context ) {
    const token            = cookie.parse( context.req.headers.cookie )
    const { access_token } = JSON.parse( atob( token.access_token ) )

    const options = {
        method:   'GET',
        headers:  {
            "Authorization": `Bearer ${ access_token }`
        },
        redirect: 'follow'
    };

    const AvailableDecks = await fetch( `${ process.env.GAME_URL }/game/deck/get/availables`, options )
    const Decks          = await AvailableDecks.json()

    return {
        props: {
            decks: Decks.data.decks
        }
    }
}

export default Decks