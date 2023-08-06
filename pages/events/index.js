import styles from '/styles/pages/explore.module.scss'
import Link from "next/link";
import checkToken from "../../utils/checkToken";
import Head from "next/head";
import Nav from "../../components/nav";
import Header from "../../components/header";
import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const Index = props => {
    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { events } = props
    const { globalUser } = useSelector(state => state.userReducer)
    const [Events, SetEvents] = useState(events)

    const Search = async e => {
        let val = e.target.value

        if (val.length > 0) {
            let request = await fetch(`${process.env.EVENT_URL}/event/explore/${val}`)
            let response = await request.json()

            SetEvents(response.data.reverse())
        } else {
            SetEvents(events)
        }
    }

    return (
        <div className={styles.page}>

            <Head>
                <title>ایونت ها</title>
            </Head>

            <Header user={globalUser} profile={false} />

            <Nav user={globalUser} />

            <div className={styles.search}>
                <label>
                    <input type={"text"} onChange={Search} placeholder={"جست و جو کنید"} />
                    <MdSearch />
                </label>
            </div>

            <div className={styles.container}>
                <div className={"page-title"}>
                    <h3>آخرین ایونت ها</h3>
                </div>
                {
                    Events.length > 0 ?
                        <ul className={styles.list}>
                            {
                                Events.map((event, index) => {
                                    const startTime = new DateObject({
                                        date: event.started_at * 1000,
                                        calendar: persian,
                                        locale: persian_fa,
                                    })
                                    return (
                                        ((index + 1) % 3 == 0) ?
                                            <li key={event._id.$oid} className={styles.full}>
                                                <Link href={`/events/${event._id.$oid}`}>
                                                    <a className={`${styles.item} ${event.is_expired ? styles.expired : ''}`} style={{ backgroundImage: `url("/e3.jpg")` }}>
                                                        {/* <h3>{event.title}</h3>
                                                    {
                                                        event.is_expired && <span className={styles.expired_text}>ایونت منقضی شده است</span>
                                                    } */}
                                                        <div className={styles.data}>
                                                            <div className={styles.event_title}>
                                                                <FaMapMarkerAlt />
                                                                <h3>
                                                                    {event.title}
                                                                </h3>
                                                            </div>
                                                            <div className={styles.row}>
                                                                <div>
                                                                    <span className={styles.time}>{startTime.format("d MMMM")}</span>
                                                                    <span>{`سناریو: ${event.content}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span>{`ظرفیت: ${event.max_players}`}</span>
                                                                    <span>{`گرداننده: ${event.group_info.owner}`}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            !event.is_expired && <button className={styles.btn}>بیشتر</button>
                                                        }
                                                    </a>
                                                </Link>
                                            </li>
                                            :
                                            <li key={event._id.$oid}>
                                                <Link href={`/events/${event._id.$oid}`}>
                                                    <a className={`${styles.item} ${event.is_expired ? styles.expired : ''}`} style={{ backgroundImage: `url("/${(index) % 2 == 0 ? 'e1' : 'e2'}.jpg")` }}>
                                                        {/* <h3>{event.title}</h3>
                                                    {
                                                        event.is_expired && <span className={styles.expired_text}>ایونت منقضی شده است</span>
                                                    } */}
                                                        <div className={styles.data}>
                                                            <div className={styles.event_title}>
                                                                <FaMapMarkerAlt />
                                                                <h3>
                                                                    {event.title}
                                                                </h3>
                                                            </div>
                                                            <span className={styles.time}>{startTime.format("d MMMM")}</span>
                                                            <span>{`سناریو: ${event.content}`}</span>
                                                            <span>{`ظرفیت: ${event.max_players}`}</span>
                                                            <span>{`گرداننده: ${event.group_info.owner}`}</span>
                                                        </div>
                                                        {
                                                            !event.is_expired && <button className={styles.btn}>بیشتر</button>
                                                        }
                                                    </a>
                                                </Link>
                                            </li>
                                    )
                                })
                            }
                        </ul> :
                        <div className={styles.notFound}>
                            <span className={styles.icon}>
                                :
                            </span>
                            <h2>متاسفانه نتیجه ای یافت نشد !!</h2>
                            <h4>لطفا دوباره تلاش کنید</h4>
                        </div>
                }

            </div>

        </div>
    )
}

export async function getServerSideProps(context) {
    // Check user
    // let user = (typeof context.req.cookies['token'] !== 'undefined') ? await checkToken(context.req.cookies['token']) : {}

    // Get events
    let events = await fetch(`${process.env.EVENT_URL}/event/get/all`)
    events = await events.json()

    return {
        props: {
            // user: user,
            events: events.data.reverse()
        }
    }
}

export default Index