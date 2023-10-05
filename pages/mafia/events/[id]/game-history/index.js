import styles from '/styles/pages/event/game-history.module.scss'
import Header from "../../../../../components/header";
import Nav from "../../../../../components/nav";
import checkToken from "../../../../../utils/checkToken";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { DateObject } from "react-multi-date-picker"
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Circular from '../../../../../components/Circular';
import { resetPhaseState } from '../../../../../redux/actions';
import { updateTime } from '../../../../../redux/actions';


const GameHistory = props => {
    const router = useRouter()

    const { globalUser } = useSelector(state => state.userReducer)
    const { selectedTime } = useSelector(state => state.timeReducer)
    const phase = useSelector(state => state.phaseReducer)
    const [event, setEvent] = useState(null)
    const [phaseNum, setPhaseNum] = useState(null)
    const [time, setTime] = useState('day')
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch();



    const loadEvent = async () => {
        let event = await fetch(`${process.env.EVENT_URL}/event/get/single/${router.query.id}/god`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let eventData = await event.json()
        console.log("eventData", eventData)
        if (eventData.status == 200) {
            setEvent(eventData.data)
            setPhaseNum(eventData.data.phases.length + 1)
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

    useEffect(() => {
        if (selectedTime) {
            setTime(selectedTime)
        }
    }, [selectedTime])

    useEffect(() => {
        if (event) {
            setLoading(false)
        }
    }, [event])

    const nextPhase = async () => {
        if (event.phases.length + 1 == phaseNum) {
            await withReactContent(Swal).fire({
                background: '#121212',
                color: '#ffffffdd',
                title: <h3 style={{ color: '#a688fa' }}>آیا مطمئن هستید ؟</h3>,
                html: 'با کلیک بر روی "تایید" به فاز جدید منتقل خواهید شد و دیگر امکان تغیر فاز قبل وجود ندارد',
                confirmButtonColor: '#a688fa',
                confirmButtonText: 'تایید',
                showCancelButton: true,
                cancelButtonColor: '#282828',
                cancelButtonText: 'انصراف'
            }).then(async e => {
                const { day, mid_day, night } = phase

                // if(!day.length || !mid_day.length || !night.length){
                //     toast.error('قبل از رفتن به فاز جدید باید فاز قبلی پر شده باشد')
                // }
                if (e.isConfirmed && globalUser.accessToken) {
                    let request = await fetch(`${process.env.EVENT_URL}/event/update/phases/add`, {
                        method: 'POST',
                        headers: {
                            "Authorization": `Bearer ${globalUser.accessToken}`
                        },
                        body: JSON.stringify({
                            event_id: event._id.$oid,
                            phase: {
                                day: day,
                                mid_day: mid_day,
                                night: night
                            }
                        })
                    })
                    let response = await request.json()

                    if (response.status == 200) {
                        toast.success('فاز قبل با موفقیت ذخیره شد')
                        dispatch(resetPhaseState());
                        dispatch(updateTime('day'))
                        setPhaseNum(prev => prev + 1)
                    } else {
                        toast.warning('خطایی در هنگام ذخیره کردن فاز قبل پیش آمده')
                    }
                }
            })
        } else setPhaseNum(prev => prev + 1)
    }

    const handleTime = (time) => {
        dispatch(updateTime(time))
    }

    return (
        <div className={styles.page}>
            {loading ? <div className='container'><Circular /></div> : <>


                <Header user={globalUser} profile={false} />

                <Nav user={globalUser} />

                <div className={`container ${styles.container}`}>

                    <header className={styles.header}>
                        <h2>فاز {phaseNum}</h2>
                        <Link href={`/mafia/events/${router.query.id}/players`}>
                            <a>
                                بازگشت
                            </a>
                        </Link>
                    </header>


                    <div className={styles.navigation}>
                        <ul>
                            <li className={time == 'day' ? styles.active : ''} onClick={() => handleTime('day')}>روز</li>
                            <li className={time == 'mid_day' ? styles.active : ''} onClick={() => handleTime('mid_day')}>رای‌گیری روز</li>
                            <li className={time == 'night' ? styles.active : ''} onClick={() => handleTime('night')}>شب</li>
                        </ul>
                    </div>

                    <div className={styles.history}>
                        {
                            (event && event.phases.length >= phaseNum) ?
                                event.phases[phaseNum - 1][time].length ?
                                    event.phases[phaseNum - 1][time].map((user, index) => {
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
                                :
                                (event && event.phases.length + 1 == phaseNum) ?
                                    phase[time].length ?
                                        phase[time].map((user, index) => {
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
                                    :
                                    <h4>تاریخچه‌ای وجود ندارد</h4>

                        }
                    </div>

                    <div className={styles.footer}>
                        <button onClick={nextPhase}>فاز بعدی</button>
                        {
                            phaseNum > 1 &&
                            (< button onClick={() => setPhaseNum(prev => prev - 1)}>فاز قبلی</button>)
                        }
                    </div>
                    <ToastContainer ariaHideApp={false} position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

                </div>
            </>}

        </div >
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

export default GameHistory