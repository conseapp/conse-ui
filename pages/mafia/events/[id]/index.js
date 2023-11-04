import styles from '/styles/pages/event/index.module.scss'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import checkToken from "../../../../utils/checkToken";
import Head from "next/head";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import Header from "../../../../components/header";
import Nav from "../../../../components/nav";
import { useSelector } from 'react-redux';
import { store } from '../../../../redux/store';
import Circular from '../../../../components/Circular';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const SingleEvent = props => {
    /**
     * Use next.js router.
     * @version 1.0
     */
    const Router = useRouter()
    const { query } = Router
    const [ingoing, setIngoing] = useState(undefined)
    const [expired, setExpired] = useState(undefined)
    const [token, setToken] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const { globalUser } = useSelector(state => state.userReducer)
    const [isVoted, setIsVoted] = useState(false)
    const [isEventLocked, setIsEventLocked] = useState(false)
    const [isEventExpired, setIsEventExpired] = useState(false)

    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { single, preloadedState } = props


    const loadEvents = async () => {
        if (globalUser && globalUser.isLoggedIn) {
            for (let i = 0; i < single.voters.length; i++) {
                if (single.voters[i].user_id == globalUser.user_id)
                    setIsVoted(true)
            }
            // props.user = await checkToken(context.req.cookies['token'])
            setToken(globalUser.accessToken)
            // Get all in-going events for current user
            let res = await fetch(`${process.env.EVENT_URL}/event/get/all/player/${single.is_expired ? 'done' : 'in-going'}`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
            })
            let data = await res.json()
            if (data.status == 200) { single.is_expired ? setExpired(data.data) : setIngoing(data.data) }
        }
    }

    useEffect(() => {
        loadEvents()
    }, [])

    useEffect(() => {
        if (globalUser && globalUser.isLoggedIn && (globalUser.access_level === 2 || globalUser.access_level === 0)) {
            if (token && (ingoing || expired))
                setLoading(false)
        } else if (globalUser && globalUser.isLoggedIn && globalUser.access_level == 1) {
            if (token)
                setLoading(false)
        } else {
            Router.push('/mafia/login')
        }
    }, [token, ingoing, expired])
    // const { user, token, single, ingoing, preloadedState } = props

    useEffect(() => {
        setIsEventLocked(single.is_locked)
        setIsEventExpired(single.started_at >= single.expires_at || single.is_expired == true)
    }, [single.is_locked, single.is_expired])

    const [TodayIsEventDay, SetTodayIsEventDay] = useState(false)

    useEffect(() => {
        let event = new Date(single.started_at * 1000)
        let current = new Date()

        let e_date = `${event.getFullYear()}/${event.getMonth()}/${event.getDay()}`,
            c_date = `${current.getFullYear()}/${current.getMonth()}/${current.getDay()}`

        SetTodayIsEventDay(e_date === c_date)
    }, [single.started_at])

    /**
     * Checking if the current user is a moderator or a player.
     * @version 1.0
     */
    const [IsUserRegistered, SetUserRegistered] = useState(false)
    console.log("ooooooooo", single)
    useEffect(() => {
        if (token && (ingoing || expired)) {
            // Check for current user access level
            if (single.group_info.owner === globalUser.user_id) {
                SetUserRegistered(false)
            } else {
                // Checking whether the current event exists in the user's ingoing event list or not
                let list = ingoing ? ingoing : expired
                list = list.filter(event => event._id.$oid === single._id.$oid)
                SetUserRegistered(list.length !== 0)
            }
        }

    }, [ingoing, expired, single, single.group_info.owner, token])

    /**
     * Function to vote an event.
     *
     * @version 1.0
     * @param is_upvote
     * @returns {Promise<void>}
     * @constructor
     */
    const VoteOnEvent = async is_upvote => {
        if (token !== undefined && single !== undefined) {
            if (isVoted == true) {
                toast.error("شما قبلا به این ایونت رای داده اید")
                return
            }
            else {
                let request = await fetch(`${process.env.EVENT_URL}/event/cast-vote`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        "_id": query.id,
                        "voter": {
                            "nft_owner_wallet_address": "",
                            "user_id": globalUser.user_id,
                            "username": globalUser.username,
                            "is_upvote": is_upvote,
                            "score": 0
                        }
                    })
                })
                let response = await request.json()

                if (response.status === 200) {
                    toast.success('رای شما با موفقیت ثبت شد')
                    setTimeout(() => Router.reload(), 3000)
                } else {
                    toast.error('خطایی در هنگام ثبت رای بوجود آمده')
                }
            }
        }
    }

    /**
     * Lock event.
     *
     * @version 1.0
     * @param e
     * @returns {Promise<void>}
     * @constructor
     */
    const LockEvent = async e => {
        if (token !== undefined) {
            let request = await fetch(`${process.env.EVENT_URL}/event/set-lock`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ "_id": query.id })
            })
            let response = await request.json()

            if (response.data.is_locked === true) {
                e.target.remove()
            }
        }
    }

    /**
     * Reserve and event
     *
     * @returns {Promise<void>}
     * @constructor
     */
    const ReserveEvent = async () => {
        if (token !== undefined) {
            const request = await fetch(`${process.env.EVENT_URL}/event/reserve/mock`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                    "event_id": query.id,
                    "requested_at": Math.floor(Date.now() / 1000)
                })
            })
            const response = await request.json()

            if (response.status === 200) {
                toast.success('شما با موفقیت در ایونت ثبت نام کردید')
                setTimeout(() => Router.reload(), 2000)
            } else {
                toast.error('خطایی در هنگام رزرو ایونت وجود دارد')
            }
        }
    }

    const cancelReserveEvent = async e => {
        e.preventDefault()

        let body = {
            event_id: query.id,
            user_id: globalUser.user_id
        }

        await withReactContent(Swal).fire({
            background: '#333',
            color: '#fff',
            title: <h3 style={{ color: 'var(--danger-color)' }}>آیا مطمئن هستید ؟</h3>,
            html: 'پس از لغو رزور از ایونت حذف میشوید',
            confirmButtonColor: 'var(--danger-color)',
            confirmButtonText: 'تایید',
            showCancelButton: true,
            cancelButtonColor: '#aaa',
            cancelButtonText: 'انصراف'
        }).then(async e => {
            if (e.isConfirmed && token) {
                let request = await fetch(`${process.env.EVENT_URL}/event/cancel`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                })
                let response = await request.json()

                if (response.status == 200) {
                    toast.success('کاربر با موفقیت از ایونت حذف شد')
                    Router.push('/mafia/events');

                } else {
                    toast.warning('خطایی در هنگام حذف بازیکن از ایونت پیش آمده')
                }
            }
        })
    }
    console.log(preloadedState)
    return (
        <div className={styles.page}>

            <Head>
                <title>{single.title}</title>
            </Head>

            <Header user={globalUser} />

            <Nav user={globalUser} />

            {loading ? <div className='container'><Circular /></div> : <>
                <div className="container" style={{ padding: 0 }}>

                    <div className={styles.header}>
                        <img src={single.image_path ? `${process.env.ADMIN_URL}/${single.image_path}` : '/e1.jpg'} alt='' />
                        <h2>{single.title}</h2>

                        <span className={styles.maxPlayers}>
                            ظرفیت {single.max_players} نفر
                        </span>

                        {
                            (IsUserRegistered && isEventExpired && isEventLocked) &&
                            <div className={styles.vote}>
                                <button type={"button"} onClick={() => { VoteOnEvent(true) }} className={styles.upvote} style={{ position: "relative" }}>
                                    <div style={{ position: "absolute", top: "-25px", color: "green", fontSize: "20px" }}>{single.upvotes}</div>
                                    <AiFillLike />
                                </button>
                                <button type={"button"} onClick={() => { VoteOnEvent(false) }} className={styles.downvote} style={{ position: "relative" }}>
                                    <AiFillDislike />
                                    <div style={{ position: "absolute", top: "-25px", color: "red", fontSize: "20px" }}>{single.downvotes}</div>
                                </button>
                            </div>
                        }

                    </div>

                    <div className={styles.content}>

                        <div className={"page-title"}><h2>توضیحات</h2></div>
                        <div className={styles.description}>
                            {single.content}
                        </div>

                    </div>

                    <div className={styles.footer}>
                        {
                            token === undefined ?
                                <Link href={`/mafia/login?redirect=/events/${single._id.$oid}`}>
                                    <a>
                                        برای رزرو ایونت لطفا وارد شوید
                                    </a>
                                </Link> :
                                single.group_info.god_id === globalUser.user_id ? // god id === global user id
                                    <>
                                        <Link href={`${query.id}/players`}>
                                            <a>
                                                مشاهده لیست بازیکنان
                                            </a>
                                        </Link>
                                        {
                                            single.is_locked === false &&
                                            <button type={"button"} onClick={LockEvent}>
                                                بستن رزرو ایونت
                                            </button>
                                        }

                                    </> :
                                    <>
                                        {
                                            !isEventExpired ?
                                                IsUserRegistered ?
                                                    TodayIsEventDay ?
                                                        <>
                                                            <Link href={`${query.id}/info/${globalUser.user_id}`}>
                                                                <a>
                                                                    مشاهده جزئیات بازی
                                                                </a>
                                                            </Link>
                                                            {
                                                                !isEventLocked &&
                                                                <button type={"button"} className={styles.danger} onClick={cancelReserveEvent}>لغو رزرو</button>
                                                            }
                                                        </>
                                                        :
                                                        <></> :
                                                    !isEventLocked ?
                                                        <button type={"button"} disabled={isEventLocked} onClick={ReserveEvent}>رزرو ایونت</button> :
                                                        <div className={styles.locked}>
                                                            <span className={styles.locked_text}>ایونت بسته شده است</span>
                                                        </div> :
                                                <div className={styles.locked}>
                                                    <span className={styles.locked_text}>ایونت منقضی شده است</span>
                                                </div>


                                        }
                                    </>
                        }
                    </div>

                </div>
            </>}
            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}



export async function getServerSideProps(context) {


    // Props
    let props = {
        // user: {},
        // token: undefined,
        single: {},
        // ingoing: {},
        preloadedState: undefined
    }
    // let _globalUser = localStorage.getItem("loginresp")
    // let globalUser = JSON.parse(_globalUser)

    let preloadedState = store.getState()
    preloadedState = JSON.stringify(preloadedState)
    props.preloadedState = preloadedState
    // Get single event details
    let single = await fetch(`${process.env.EVENT_URL}/event/get/single`, {
        method: 'POST',
        body: JSON.stringify({ "_id": context.query.id })
    })
    single = await single.json()
    props.single = single.data

    // if (typeof context.req.cookies['token'] !== 'undefined') {
    //     // props.user = await checkToken(context.req.cookies['token'])
    //     props.user = context.req.cookies['token']
    //     props.token = context.req.cookies['token']

    //     // Get all in-going events for current user
    //     let ingoing = await fetch(`${process.env.EVENT_URL}/event/get/all/player/in-going`, {
    //         method: 'POST',
    //         headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
    //     })
    //     ingoing = await ingoing.json()

    //     props.ingoing = ingoing.data
    // }

    return { props: props }
}

export default SingleEvent