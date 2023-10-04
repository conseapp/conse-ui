import styles from '/styles/pages/event/phase.module.scss'
import Header from "../../../../../components/header";
import Nav from "../../../../../components/nav";
import checkToken from "../../../../../utils/checkToken";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { DateObject } from "react-multi-date-picker"

const Phase = props => {
    const router = useRouter()

    const { time, phase } = router.query
    const [event, setEvent] = useState(null)
    const { globalUser } = useSelector(state => state.userReducer)

    const loadEvent = async () => {
        let event = await fetch(`${process.env.EVENT_URL}/event/get/single/${router.query.id}/god`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let eventData = await event.json()
        console.log("eventData", eventData)
        if (eventData.status == 200) {
            setEvent(eventData.data)
        } else if (eventData.status == 403) {
            toast.error("ورود به این صفحه برای شما مجاز نیست")
            setTimeout(() => {
                router.push("/mafia/profile")
            }, 2000);
        }
    }

    useEffect(() => {
        if (globalUser && globalUser.accessToken && router.query.id) {
            loadEvent()
        }
    }, [globalUser, router.query.id])

    const PhaseCalculation = () => {
        let out = ''

        if (phase === '0') {
            out = 'شب معارفه'
        } else {
            if (time === 'day') {
                out = 'روز '
            }
            if (time === 'mid_day') {
                out = 'رای گیری روز '
            }
            if (time === 'night') {
                out = 'شب '
            }

            out += phase
        }

        return out
    }

    const [nextPhase, setNextPhase] = useState('#')
    useEffect(() => {
        let href = `/mafia/events/${router.query.id}/`

        if (time === 'day') {
            href += `mid_day/${phase}`
        } else if (time === 'mid_day') {
            href += `night/${phase}`
        } else if (time === 'night') {
            href += `day/${parseInt(phase) + 1}`
        }

        setNextPhase(href)

        // console.log(event.phases[phase][time], 'here');
    }, [phase, router.query.id, setNextPhase, time])

    const [prevPhase, setPrevPhase] = useState('#')
    useEffect(() => {
        let href = `/mafia/events/${router.query.id}/`

        if (time === 'day') {
            href += `night/${parseInt(phase) - 1}`
        } else if (time === 'night') {
            href += `mid_day/${phase}`
        } else if (time === 'mid_day') {
            href += `day/${phase}`
        }

        setPrevPhase(href)
    }, [phase, router.query.id, setPrevPhase, time])

    return (
        <div className={styles.page}>

            <Header user={globalUser} profile={false} />

            <Nav user={globalUser} />

            <div className={`container ${styles.container}`}>

                <header className={styles.header}>
                    <h2>
                        {PhaseCalculation()}
                    </h2>
                </header>
                    <Link href={`/mafia/events/${router.query.id}/players`}>
                        <a>
                            بازگشت
                        </a>
                    </Link>

                <div className={styles.history}>
                    {
                        (event && event.phases.length > phase) ?
                            event.phases[phase][time].length ?
                                event.phases[phase][time].map((user, index) => {
                                    return (
                                        <div className={styles.user} key={index}>
                                            <div className={styles.userInfo}>
                                                <span>
                                                    <p>نام کاربری : </p>
                                                    <b>{user.username}</b>
                                                </span>
                                                <span>
                                                    <p>نقش : </p>
                                                    <b>{user.role_name}</b>
                                                </span>
                                                <span>
                                                    <p>شناسه : </p>
                                                    <b>{user.user_id}</b>
                                                </span>
                                            </div>

                                            <div className={styles.tables}>
                                                <p>تاریخچه چین :</p>                                           <table key={index}>
                                                    <thead>
                                                        <tr>
                                                            <th>به شناسه</th>
                                                            <th>زمان</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            user.chain_history.map((key, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{key.to_id}</td>
                                                                        <td>{new DateObject(key.chained_at * 1000).format('HH:mm:ss')}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className={styles.tables}>
                                                <p>تاریخچه قابلیت نقش :</p>                                           <table key={index}>
                                                    <thead>
                                                        <tr>
                                                            <th>شناسه قابلیت نقش</th>
                                                            <th>قابلیت نقش فعلی</th>
                                                            <th>زمان بروزرسانی</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            user.role_ability_history.map((key, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{key.role_id}</td>
                                                                        <td>{key.current_ability}</td>
                                                                        <td>{new DateObject(key.updated_at * 1000).format('HH:mm:ss')}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                    </tbody>
                                                </table>
                                                <hr />
                                            </div>
                                        </div>
                                    );
                                })
                                :
                                <h4>تاریخچه‌ای وجود ندارد</h4>
                            : <h4>تاریخچه‌ای وجود ندارد</h4>

                    }
                </div>

                <div className={styles.footer}>
                    <Link href={nextPhase}>
                        <a>فاز بعدی</a>
                    </Link>
                    {
                        parseInt(phase) > 0 &&
                        <Link href={prevPhase}>
                            <a>فاز قبلی</a>
                        </Link>
                    }
                </div>
            </div>
        </div>
    )
}

// export async function getServerSideProps( context ) {
//     let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

//     return {
//         props: {
//             user: user
//         }
//     }
// }

export default Phase