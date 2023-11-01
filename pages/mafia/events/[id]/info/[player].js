import checkToken from "../../../../../utils/checkToken";
import styles from "../../../../../styles/pages/event/info/player.module.scss";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Header from "../../../../../components/header";
import Nav from "../../../../../components/nav";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { MdRefresh } from "react-icons/md";
import CreateSideColor from "../../../../../utils/createSideColor";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Circular from "../../../../../components/Circular";

const Info = props => {
    const router = useRouter()
    const { query } = router

    const { globalUser } = useSelector(state => state.userReducer)

    const getPlayerAndDeck = async () => {
        // Get current player info
        let player = await fetch(`${process.env.GAME_URL}/game/player/get/single`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
            body: JSON.stringify({
                "event_id": query.id,
                "user_id": query.player
            })
        })
        let playerData = await player.json()
        console.log(playerData)
        if (playerData.status == 200) {
            setPlayer(playerData.data)
            setIsPlayer(true)
        } else if (playerData.status == 404) {
            setPlayer(false)
            toast.error("بازیکن یافت نشد")
            router.push('/')
        }
        else if (playerData.status == 403) {
            setPlayer(false)
        }

        // Get current event deck
        let deck = await fetch(`${process.env.GAME_URL}/game/deck/get/single`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
            body: JSON.stringify({ "_id": event.data.deck_id })
        })
        let deckData = await deck.json()
        console.log(deckData)
        if (deckData.status == 200)
            setDeck(deckData.data.roles)
    }

    // const { user, token, player, deck } = props
    const { event } = props
    const [player, setPlayer] = useState(undefined)
    const [deck, setDeck] = useState(undefined)
    const [status, setStatus] = useState('...')
    const [newUser, updateUser] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [isPlayer, setIsPlayer] = useState(false)

    let StatusText = number => {
        if (number === 0) setStatus('شما در حال بازی هستید')
        if (number === 1) setStatus('شما از بازی اخراج شدید')
        if (number === 2) setStatus('شما از بازی خارج شدید')
        if (number === 3) setStatus('تمام توانایی های شما برای 3 شب گرفته شده')
        if (number === 4) setStatus('تمام توانایی های شما برای همیشه گرفته شده')
        if (number === 5) setStatus('به مدت 2 شب سایلنت هستید')
        if (number === 6) setStatus('به مدت 6 شب سایلنت هستید')
        if (number === 7) setStatus('به یک بازیکن متصل شدید')
        if (number === 8) setStatus('نقش شما تغییر کرده')
        if (number === 9) setStatus('ساید شما تغییر کرده')
        if (number === 10) setStatus('از بازی خارج شده اید')
        if (number === 11) setStatus('شما خدا رو فدا کرده اید')
        if (number === 12) setStatus('قاتل حرفه ای به دنبال شماست')
    }
    useEffect(() => { if (globalUser && globalUser.accessToken) getPlayerAndDeck() }, [globalUser])
    useEffect(() => {
        if (player) {
            StatusText(player.status)
            updateUser(player)
        }
    }, [player])
    useEffect(() => { if (player && deck) setLoading(false) }, [player, deck])

    const reloadUser = async e => {
        let request = await fetch(`${process.env.GAME_URL}/game/player/get/single`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
            body: JSON.stringify({
                "event_id": router.query.id,
                "user_id": router.query.player
            })
        })
        let response = await request.json()
        console.log(response)
        if (response.status === 200) {
            updateUser(response.data)

            StatusText(response.data.status)
        }
    }

    const showRoleDetails = e => {
        let id = e.target.getAttribute('data-id')

        deck.map(role => {
            if (role._id === id) {
                withReactContent(Swal).fire({
                    ...CreateSideColor(role.side_id),
                    title: <h3>{role.name}</h3>,
                    html: <div dangerouslySetInnerHTML={{ __html: role.desc }}></div>,
                    confirmButtonColor: 'var(--primary-color)',
                    confirmButtonText: 'متوجه شدم'
                })
            }
        })
    }

    return (
        <div className={styles.page}>

            <Head>
                <title>اطلاعات شما در این ایونت</title>
            </Head>

            <Header user={globalUser} profile={false} />

            <Nav user={globalUser} />
            {globalUser && globalUser.isLoggedIn ?
                <>
                    {isPlayer && globalUser.access_level == 2 ?
                        <>
                            {loading ? <><Circular /></> : <>
                                <div className="container">

                                    <div className={styles.card}>

                                        <button type={"button"} onClick={reloadUser}>
                                            <MdRefresh />
                                        </button>

                                        <div className={styles.info}>
                                            <Image src={'/avatar.png'} alt={player.username} width={100} height={100} />
                                            <h2>{player.username}</h2>
                                            {
                                                event.data.is_locked &&
                                                < span style={newUser.side_id !== null ? CreateSideColor(newUser.side_id.$oid) : {}}>
                                                    {newUser.role_name}
                                                </span>
                                            }
                                        </div>

                                        <div className={styles.boxes}>
                                            <div className={styles.status}>
                                                {
                                                    event.data.is_locked ?
                                                        <div>
                                                            وضعیت شما در بازی
                                                            <p>
                                                                {status}
                                                            </p>
                                                        </div> :
                                                        <div>
                                                            <p>
                                                                ایونت هنوز شروع نشده است
                                                            </p>
                                                        </div>
                                                }
                                            </div>
                                            <div className={styles.role}></div>
                                        </div>

                                    </div>

                                    <div className={styles.deck}>
                                        <div className="page-title">
                                            <h2>دک بازی</h2>
                                        </div>

                                        <table>
                                            <tbody>
                                                {
                                                    deck.map(role => {
                                                        return (
                                                            <tr key={role._id}>
                                                                <td style={{ color: CreateSideColor(role.side_id).background }}>{role.name}</td>
                                                                <td>
                                                                    <button type={"button"} onClick={showRoleDetails} data-id={role._id}>
                                                                        توضیحات
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                </div></>}
                        </>
                        :
                        <><div className="container">شما مجاز به ورود به این بخش نمیباشید</div></>}
                </>
                :
                <><div className="container">لطفا وارد حساب کاربری خود شوید</div></>}
        </div >
    )
}

export async function getServerSideProps(context) {
    // Check user
    // let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

    // Get current player info
    // let player = await fetch( `${ process.env.GAME_URL }/game/player/get/single`, {
    //     method:  'POST',
    //     headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` },
    //     body:    JSON.stringify( {
    //         "event_id": context.query.id,
    //         "user_id":  context.query.player
    //     } )
    // } )
    // player     = await player.json()

    // Get current event deck
    let event = await fetch(`${process.env.EVENT_URL}/event/get/single`, {
        method: 'POST',
        body: JSON.stringify({ "_id": context.query.id })
    })
    event = await event.json()

    // Get current event deck
    // let deck = await fetch( `${ process.env.GAME_URL }/game/deck/get/single`, {
    //     method:  'POST',
    //     headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` },
    //     body:    JSON.stringify( { "_id": event.data.deck_id } )
    // } )
    // deck     = await deck.json()

    return {
        props: {
            // user:   user,
            // token:  context.req.cookies['token'],
            // player: player.data,
            // deck:   deck.data.roles
            event: event
        }
    }
}

export default Info