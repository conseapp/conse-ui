import styles from '/styles/pages/home.module.scss'
import Head from "next/head";
import Header from "/components/header";
// import checkToken from "../utils/checkToken";
import Nav from "../../components/nav";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import { MdChevronLeft } from "react-icons/md";
// import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Alert from "../../components/alert";
import { FaMapMarkerAlt } from "react-icons/fa";
import { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import CreateSideColor from "../../utils/createSideColor";

// import { getuser } from '../redux/actions';

const Index = props => {
    const router = useRouter()
    // const dispatch = useDispatch();
    // const fetchUser = () => dispatch(getuser());
    // useEffect(() => {
    //     fetchUser();
    // }, []);


    const { globalUser } = useSelector(state => state.userReducer)
    const [ingoing, setIngoing] = useState(undefined)
    const [todayEvent, setTodayEvent] = useState(undefined)
    const [startTime, setStartTime] = useState(undefined)
    const [player, setPlayer] = useState(undefined)


    const loadInGoing = async () => {
        let res = await fetch(`${process.env.EVENT_URL}/event/get/all/player/in-going`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let data = await res.json()
        if (data.status == 200)
            setIngoing(data.data)

    }

    const getPlayer = async () => {
        // Get current player info
        let player = await fetch(`${process.env.GAME_URL}/game/player/get/single`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
            body: JSON.stringify({
                "event_id": todayEvent._id.$oid,
                "user_id": globalUser.user_id
            })
        })
        let playerData = await player.json()
        if (playerData.status == 200) {
            setPlayer(playerData.data)
        } else if (playerData.status == 404) {
            setPlayer(false)
            toast.error("بازیکن یافت نشد")
        }
        else if (playerData.status == 403) {
            setPlayer(false)
        }
    }

    useEffect(() => {
        if (globalUser && globalUser.isLoggedIn && (globalUser.access_level === 1 || globalUser.access_level === 0)) {
            router.push('/mafia/profile')
        }
    }, [globalUser])

    useEffect(() => {
        if (globalUser && globalUser.isLoggedIn && (globalUser.access_level === 2)) {
            loadInGoing()
        }
    }, [globalUser])

    useEffect(() => {
        if (ingoing) {
            ingoing.forEach((e) => {
                let event = new Date(e.started_at * 1000)
                let current = new Date()

                let e_date = `${event.getFullYear()}/${event.getMonth()}/${event.getDay()}`,
                    c_date = `${current.getFullYear()}/${current.getMonth()}/${current.getDay()}`

                if (e_date == c_date) {
                    setTodayEvent(e)
                }
            });
        }
    }, [ingoing])

    useEffect(() => {
        if (todayEvent) {
            setStartTime(new DateObject({
                date: todayEvent.started_at * 1000,
                calendar: persian,
                locale: persian_fa,
            }))
            getPlayer()
        }
    }, [todayEvent])


    /**
     * Get all props of this page.
     * @version 1.0
     */
    // const { events } = props

    return (
        <div className={styles.page}>
            <Head>
                <title>کنسه</title>
            </Head>

            <Header user={globalUser} />

            <div className="container">
                <div className={styles.lastEvents}>
                    <div className={"page-title"}>
                        <h3>ایونت در حال بازی</h3>
                        <Link href={"/mafia/events"}>
                            <a>
                                بیشتر
                                <MdChevronLeft />
                            </a>
                        </Link>
                    </div>

                    {
                        todayEvent ?
                            <>
                                <div className={styles.event}>
                                    <Link href={`/mafia/events/${todayEvent._id.$oid}`}>
                                        <a className={`${styles.item}`}>
                                            <img src={todayEvent.image_path ? `${process.env.ADMIN_URL}/${todayEvent.image_path}` : '/e1.jpg'} alt='' />
                                            <div className={styles.data}>
                                                <div className={styles.event_title}>
                                                    <FaMapMarkerAlt />
                                                    <h3>
                                                        {todayEvent.title}
                                                    </h3>
                                                </div>
                                                <div className={styles.row}>
                                                    {
                                                        startTime ?
                                                            <div>
                                                                <span className={styles.time}>{startTime.format("d MMMM")}</span>
                                                                <span>سناریو: {todayEvent.content}</span>
                                                            </div> : <></>
                                                    }
                                                    {
                                                        (player && todayEvent.is_locked) ?
                                                            <span className={styles.role} style={player.side_id !== null ? CreateSideColor(player.side_id.$oid) : {}}>
                                                                {player.role_name}
                                                            </span>
                                                            : <></>
                                                    }
                                                    <div>
                                                        <span>ظرفیت: {todayEvent.max_players}</span>
                                                        <span>گرداننده: {todayEvent.group_info.owner}</span>
                                                        <span>نام گروه: {todayEvent.group_info.name}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button className={styles.btn}>بیشتر</button>

                                        </a>
                                    </Link>
                                </div>
                            </>
                            : <Alert type={'info'}>
                                شما در حال بازی هیچ ایونتی نیستید
                            </Alert>
                    }
                </div>
            </div>

            <Nav user={globalUser} />
        </div >
    )
}

// export async function getServerSideProps() {
//     // Check user
//     // let user = (typeof context.req.cookies['token'] !== 'undefined') ? await checkToken(context.req.cookies['token']) : {}

//     // Get events
//     // let events = await fetch(`${process.env.EVENT_URL}/event/get/all/in-going`)
//     // events = await events.json()

//     // return {
//     //     props: {
//     //         // user: user,
//     //         events: events.data
//     //     }
//     // }
// }

export default Index