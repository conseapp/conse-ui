import styles from "/styles/pages/conductor/group/index.module.scss";
import Link from "next/link";
import { MdAdd, MdEdit } from "react-icons/md";
import * as cookie from "cookie";

const Decks = props => {
    return (
        <div className={ styles.page }>

            <Link href={ 'group/create' }>
                <a className={ styles.addButton }>
                    <MdAdd />
                    ایجاد گروه
                </a>
            </Link>

            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>نام گروه</th>
                    <th>عملیات</th>
                </tr>
                </thead>
                <tbody>
                {
                    props.groups.map( ( deck, index ) => {
                        return (
                            <tr key={ deck._id.$oid }>
                                <td>{ index + 1 }</td>
                                <td>{ deck.name }</td>
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
    let { access_token } = cookie.parse( context.req.headers.cookie )

    const options = {
        method:   'GET',
        headers:  {
            "Authorization": `Bearer ${ access_token }`
        },
        redirect: 'follow'
    };

    const response = await fetch( `${ process.env.GAME_URL }/game/get/group/all`, options )
    const { data } = await response.json()

    return {
        props: {
            groups: data.groups
        }
    }
}

export default Decks