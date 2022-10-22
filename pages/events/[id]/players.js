import styles from '/styles/pages/event/players.module.scss'
import Head from "next/head";
import { MdClose, MdRefresh, MdSettings } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CreateSideColor from "../../../utils/createSideColor";
import Modal from 'react-modal';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import checkToken from "../../../utils/checkToken";
import Header from "../../../components/header";
import Nav from "../../../components/nav";
import statuses from "../../../utils/allPossibleStatus";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';

const Players = props => {
    const router = useRouter()
    const { query } = router
    // const { user, token, event, sides, deck } = props

    const [Players, SetPlayers] = useState(undefined)
    const [token, setToken] = useState(undefined)
    const [event, setEvent] = useState(undefined)
    const [sides, setSides] = useState(undefined)
    const [deck, setDeck] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const { globalUser } = useSelector(state => state.userReducer)

    const ToggleConductorMenu = async () => {
        let menu = document.querySelector(`.${styles.conductorMenu}`)
        menu.classList.toggle(styles.open)
    }
    const loadEvents = async () => {
        if (globalUser && globalUser.isLoggedIn)
            setToken(globalUser.accessToken)
    }
    const loadStuff = async () => {
        let event = await fetch(`${process.env.EVENT_URL}/event/get/single/${query.id}/god`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let eventData = await event.json()
        console.log("eventData", eventData)
        if (eventData.status == 200) {
            setEvent(eventData.data)
            SetPlayers(eventData.data.players)
        }
        else if (eventData.status == 403) {
            toast.error("ورود به این صفحه برای شما مجاز نیست")
            setTimeout(() => {
                router.push("/")
            }, 2000);
        }
        let sides = await fetch(`${process.env.EVENT_URL}/game/side/get/availables`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let sideData = await sides.json()
        console.log("sidesData", sideData)
        if (sideData.status == 200)
            setSides(sideData.data.sides)
    }
    useEffect(() => {
        if (event)
            loadDeck()
    }, [event])
    const loadDeck = async () => {
        let deck = await fetch(`${process.env.GAME_URL}/game/deck/get/single`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
            body: JSON.stringify({
                '_id': event.data.deck_id
            })
        }
        )
        let deckData = await deck.json()
        console.log("deckdata", deckData)
        if (deckData.status == 200) {
            setDeck(deckData.data)
            SetAvailableCards(deckData.data.last_move_cards)
        }
    }
    useEffect(() => {
        if (globalUser && globalUser.accessToken)
            loadStuff()
    }, [globalUser])
    useEffect(() => {
        console.log(event, sides, deck, Players, AvailableCards)
        if (event && sides && deck && Players && AvailableCards) {
            console.log(event, sides, deck, Players, AvailableCards)
            setLoading(false)
        }
    }, [event, sides, deck, Players, AvailableCards])

    const RevealRoles = async () => {
        if (token) {
            const request = await fetch(`${process.env.EVENT_URL}/event/reveal/roles`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ "_id": query.id })
            })
            const response = await request.json()

            if (response.status === 200) {
                SetPlayers(response.data.players)
            }
        }
    }

    const [TodayIsEventDay, SetTodayIsEventDay] = useState(false)

    useEffect(() => {
        if (event) {
            let current_event = new Date(event.started_at * 1000)
            let current_day = new Date()

            let e_date = `${current_event.getFullYear()}/${current_event.getMonth()}/${current_event.getDay()}`,
                c_date = `${current_day.getFullYear()}/${current_day.getMonth()}/${current_day.getDay()}`

            SetTodayIsEventDay(e_date === c_date)
        }
    }, [event])

    /**
     * Modal Config
     */
    const [ModalIsOpen, SetModalIsOpen] = useState(false)
    const [ModalUser, SetModalUser] = useState({})
    const OpenModal = user => {
        if (sides && token && event && deck) {
            SetModalUser(user)
            SetModalIsOpen(true)
        }
    }
    const CloseModal = () => SetModalIsOpen(false)
    const ModalStyles = {
        overlay: {
            zIndex: 4,
            background: 'rgba(0,0,0,0.7)',
            padding: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        content: {
            width: '100%',
            position: 'unset',
            padding: '32px',
            borderRadius: '8px'
        }
    }

    const ChangePlayerStatus = async e => {
        if (token) {
            const request = await fetch(`${process.env.GAME_URL}/game/player/update/status`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    "user_id": ModalUser._id.$oid,
                    "status": parseInt(e.target.value),
                    "event_id": query.id
                })
            })
            const response = await request.json()
        }
    }

    const ChangePlayerSide = async e => {
        if (token) {
            const request = await fetch(`${process.env.GAME_URL}/game/player/update/side`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    "user_id": ModalUser._id.$oid,
                    "side_id": e.target.value,
                    "event_id": query.id
                })
            })
            const response = await request.json()
        }
    }

    const ChangePlayerRole = async e => {
        if (token) {
            const request = await fetch(`${process.env.GAME_URL}/game/player/update/role`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    "user_id": ModalUser._id.$oid,
                    "role_id": JSON.parse(e.target.value).id,
                    "event_id": query.id
                })
            })
            const response = await request.json()
        }
    }

    const [AvailableCards, SetAvailableCards] = useState(undefined)

    const ShowLastMoveCard = async e => {
        let cards = AvailableCards
        let newCards = []

        let random = Math.floor(Math.random() * cards.length)
        let card = cards[random]

        delete cards[random]

        cards.filter(c => {
            if (typeof c !== 'undefined') {
                newCards.push(c)
            }
        })

        SetAvailableCards(newCards)

        if (typeof card !== 'undefined') {
            await withReactContent(Swal).fire({
                background: '#F6F6F6',
                color: '#333',
                title: <h3 style={{ color: 'var(--danger-color)' }}>{card.name}</h3>,
                html: <div dangerouslySetInnerHTML={{ __html: card.desc }}></div>,
                confirmButtonColor: 'var(--primary-color)',
                confirmButtonText: 'متوجه شدم'
            })
        } else {
            toast.warning('کارت حرکت آخر دیگری وجود ندارد! در صورت نیاز صفحه را رفرش کنید')
        }
    }

    const LockEvent = async e => {
        let button = e.target

        await withReactContent(Swal).fire({
            background: '#F6F6F6',
            color: '#333',
            title: <h3 style={{ color: 'var(--danger-color)' }}>آیا مطمئن هستید ؟</h3>,
            html: 'پس از بستن ایونت نمیتوانید تغییری در آن ایجاد کنید و یا دوباره آن را باز کنید',
            confirmButtonColor: 'var(--danger-color)',
            confirmButtonText: 'بله میخوام ببندم',
            showCancelButton: true,
            cancelButtonColor: 'var(--text-color)',
            cancelButtonText: 'خیر، میخوام تغییرات ایجاد کنم'
        }).then(async e => {
            if (e.isConfirmed && token) {
                let request = await fetch(`${process.env.EVENT_URL}/event/set-lock`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "_id": query.id
                    })
                })
                let response = await request.json()

                if (response.data.is_locked) {
                    toast.success('ایونت با موفقیت بسته شد')
                    button.remove()
                } else {
                    toast.warning('خطایی در هنگام بستن ایونت پیش آمده')
                }
            }
        })
    }

    const UpdateEvent = async e => {
        e.preventDefault()

        let status = document.querySelector('#status').value
        let side = document.querySelector('#side').value
        let role = JSON.parse(document.querySelector('#role').value)

        let allPlayers = event.players

        let updateCurrentUser = {
            ...ModalUser,
            'role_id': role.id,
            'role_name': role.name,
            'status': parseInt(status),
            'side_id': side
        }

        allPlayers.map((player, index) => {
            if (player._id.$oid === updateCurrentUser._id.$oid) {
                allPlayers[index] = updateCurrentUser
            }
        })

        let body = {
            "title": event.title,
            "content": event.content,
            "deck_id": event.deck_id,
            "entry_price": event.entry_price,
            "group_info": event.group_info,
            "creator_wallet_address": event.creator_wallet_address,
            "upvotes": event.upvotes,
            "downvotes": event.downvotes,
            "voters": event.voters,
            "phases": event.phases,
            "max_players": event.max_players,
            "started_at": event.started_at,
            "players": allPlayers
        }

        let request = await fetch(`${process.env.EVENT_URL}/event/add`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: JSON.stringify(body)
        })
        let response = await request.json()

        if (response.status === 302) {
            SetPlayers(response.data.players)
            toast.success('اطلاعات جدید با موفقیت ذخیره شد')
        }
    }

    const StartEvent = async e => {
        let href = `/events/${query.id}/night/0`

        await router.push(href)
    }

    return (
        <div className={styles.page}>

            {loading ? <div className='container'>...</div> : <>

                <Head>
                    <title>بازیکنان {event.title}</title>
                </Head>

                <Header user={globalUser} profile={false} />

                <Nav user={globalUser} />

                <div className="container">

                    <div className={styles.content}>

                        <header className={styles.header} style={{ backgroundImage: "url(/event-detail-header.png)" }}>
                            <h2>{event.title}</h2>
                            <span>بازیکنان : {event.players.length} نفر</span>
                        </header>

                        <div className={styles.players}>
                            <ul>
                                {
                                    Players.map(player => {
                                        return (
                                            <li key={player._id.$oid}
                                                style={player.side_id !== null ? CreateSideColor(player.side_id.$oid) : {}}>
                                                <div className={styles.info}>
                                                    <strong>{player.username}</strong>
                                                    {player.role_id &&
                                                        <span>
                                                            {deck.roles.map(role => {
                                                                if (role._id === player.role_id.$oid) {
                                                                    return role.name
                                                                }
                                                            })}
                                                        </span>}
                                                </div>
                                                <button type={"button"} onClick={() => { OpenModal(player) }}>
                                                    <MdRefresh />
                                                </button>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>

                    </div>

                    {
                        TodayIsEventDay &&
                        <div className={styles.conductorMenu}>
                            <button type={"button"} onClick={ToggleConductorMenu}>
                                <MdSettings />
                            </button>
                            <header>پنل گرداننده</header>
                            <ul>
                                <li>
                                    <button type={"button"} onClick={RevealRoles}>پخش کردن نقش ها</button>
                                </li>
                                <li>
                                    <button type={"button"} onClick={ShowLastMoveCard}>نمایش کارت حرکت آخر</button>
                                </li>
                                {
                                    !event.is_locked &&
                                    <li>
                                        <button type={"button"} onClick={LockEvent}>بستن ایونت</button>
                                    </li>
                                }
                                {/* comment start game for now to uncomment after phases done */}
                                {/* <li>
                                    <button type={"button"} onClick={StartEvent}>شروع بازی</button>
                                </li> */}
                            </ul>
                        </div>
                    }

                </div>
            </>}
            <div id={"ModalContainer"} />

            <Modal isOpen={ModalIsOpen} style={ModalStyles} onRequestClose={CloseModal} contentLabel="Example Modal">
                <div className={styles.modalHeader}>
                    <h3>تغییر وضعیت {ModalUser.username}</h3>
                    <button type={"button"} onClick={CloseModal}>
                        <MdClose />
                    </button>
                </div>
                <div className={styles.modalBody}>

                    <div className={styles.row}>
                        <label htmlFor={"status"}>وضعیت پلیر</label>
                        <select id={"status"} onChange={ChangePlayerStatus}>
                            {
                                statuses.map((status, index) => {
                                    let isSelected = false
                                    if (Object.keys(ModalUser).length !== 0) {
                                        if (ModalUser.status === index) {
                                            isSelected = true
                                        }
                                    }
                                    return (
                                        <option key={index} value={index} selected={isSelected}>{status}</option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className={styles.row}>
                        <label htmlFor={"side"}>تغییر ساید پلیر</label>
                        <select id={"side"} onChange={ChangePlayerSide}>
                            {sides ? <>
                                {sides.map(side => {
                                    let isSelected = false
                                    if (Object.keys(ModalUser).length !== 0) {
                                        if (ModalUser.side_id !== null) {
                                            if (ModalUser.side_id.$oid === side._id.$oid) {
                                                isSelected = true
                                            }
                                        }
                                    }
                                    return <option key={side._id.$oid} value={side._id.$oid} selected={isSelected}>{side.name}</option>
                                })}</> : undefined}
                        </select>
                    </div>

                    <div className={styles.row}>
                        <label htmlFor={"role"}>تغییر نقش پلیر</label>
                        <select id={"role"} onChange={ChangePlayerRole}>
                            {deck ? <>
                                {deck.roles.map(role => {
                                    let isSelected = false
                                    if (Object.keys(ModalUser).length !== 0) {
                                        if (ModalUser.role_id !== null) {
                                            if (ModalUser.role_id.$oid === role._id) {
                                                isSelected = true
                                            }
                                        }
                                    }
                                    return (
                                        <option key={role._id}
                                            value={JSON.stringify({
                                                'id': role._id,
                                                'name': role.name
                                            })}
                                            selected={isSelected}>
                                            {role.name}
                                        </option>
                                    )
                                })}</> : undefined}
                        </select>
                    </div>

                    <div className={styles.row}>
                        <button type={"button"} onClick={UpdateEvent}>ذخیره</button>
                    </div>

                </div>
            </Modal>

            <ToastContainer ariaHideApp={false} position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

// export async function getServerSideProps(context) {
//     // Check user
//     let user = (typeof context.req.cookies['token'] !== 'undefined') ? await checkToken(context.req.cookies['token']) : {}

//     let event = await fetch(`${process.env.EVENT_URL}/event/get/single/${context.query.id}/god`, {
//         method: 'POST',
//         headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
//     })
//     event = await event.json()

//     let sides = await fetch(`${process.env.EVENT_URL}/game/side/get/availables`, {
//         method: 'GET',
//         headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
//     })
//     sides = await sides.json()

//     let deck = await fetch(`${process.env.GAME_URL}/game/deck/get/single`, {
//         method: 'POST',
//         headers: { "Authorization": `Bearer ${context.req.cookies['token']}` },
//         body: JSON.stringify({
//             '_id': event.data.deck_id
//         })
//     }
//     )
//     deck = await deck.json()

//     return {
//         props: {
//             user: user,
//             token: context.req.cookies['token'],
//             event: event.data,
//             sides: sides.data.sides,
//             deck: deck.data
//         }
//     }
// }

export default Players