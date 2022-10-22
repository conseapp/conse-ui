import styles from "/styles/pages/conductor/event/index.module.scss";
import Link from "next/link";
import { MdAdd, MdEdit } from "react-icons/md";
import Head from "next/head";
import Header from "../../../components/header";
import checkToken from "../../../utils/checkToken";
import Nav from "../../../components/nav";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Decks = props => {
    /**
     * Get all props of this page.
     * @version 1.0
     */
    // const { user, events } = props
    const { globalUser } = useSelector(state => state.userReducer)
    const [events, setEvents] = useState(undefined)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (globalUser.accessToken)
            loadEvents()
        else {
            toast.error("وارد حساب کاربری خود شوید")
            setTimeout(() => {
                Router.push('/login')
            }, 2000)
        }
    }, [globalUser])
    const loadEvents = async () => {
        let events = await fetch(`${process.env.EVENT_URL}/event/get/all/god`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let eventData = await events.json()
        console.log(eventData)
        if (eventData.status == 200)
            setEvents(eventData.data)
        else if (eventData.status == 403)
            toast.error("سطح دسترسی ندارید")
        else if (eventData.status == 404)
            setEvents([])
    }
    useEffect(() => {
        if (events)
            setLoading(false)
    }, [events])

    return (
        <div className={styles.page}>

            <Head>
                <title>ایونت های شما</title>
            </Head>

            <Header user={globalUser} />

            <Nav user={globalUser} />
            {globalUser.isLoggedIn && (globalUser.access_level == 0 || globalUser.access_level == 1) ? <>
                {loading ? <><div>loading...</div></> : <>
                    <div className="container">

                        <Link href={'event/create'}>
                            <a className={styles.addButton}>
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
                                {events.map((event, index) => {
                                    return (
                                        <tr key={event._id.$oid}>
                                            <td>{index + 1}</td>
                                            <td>{event.title}</td>
                                            <td>
                                                <Link href={`/conductor/event/${event._id.$oid}`}>
                                                    <a>
                                                        <MdEdit />
                                                    </a>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                    </div>
                </>}</> : <div className="container">
                سطح دسترسی ندارید
            </div>}
        </div>
    )
}

/**
 * @param context
 * @returns {Promise<{props: {events}}>}
 */
// export async function getServerSideProps( context ) {
//     // Check user
//     let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

//     let events = await fetch( `${ process.env.EVENT_URL }/event/get/all/god`, {
//         method:  "GET",
//         headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
//     } )
//     events     = await events.json()

//     return {
//         props: {
//             user:   user,
//             events: events.data
//         }
//     }
// }

export default Decks