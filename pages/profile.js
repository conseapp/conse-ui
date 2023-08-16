import styles from '/styles/pages/profile/index.module.scss'
import React, { useEffect, useState } from "react";
import { MdInfo } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import checkToken from "../utils/checkToken";
import Head from "next/head";
import Header from "../components/header";
import Nav from "../components/nav";
import Alert from "../components/alert";
import { useDispatch, useSelector } from 'react-redux';
import { getuser } from '../redux/actions';
import Circular from '../components/Circular';
import { FaMapMarkerAlt } from "react-icons/fa";
import { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useRouter } from 'next/router';
/**
 * Profile Page
 * @version 1.0
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Profile = props => {

    // const dispatch = useDispatch();
    // const fetchUser = () => dispatch(getuser());
    // useEffect(() => {
    //     fetchUser();
    // }, []);

    const { globalUser } = useSelector(state => state.userReducer)
    let user = (globalUser && globalUser.accessToken) ? checkToken(globalUser.accessToken) : {}
    const router = useRouter();
    const [ingoing, setIngoing] = useState(undefined)
    const [expired, setExpired] = useState(undefined)
    const [godEvents, setGodEvents] = useState(undefined)
    const [groups, setGroups] = useState(undefined)
    const [username, setUsername] = useState(undefined)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const [CanCreateGroup, setCanCreateGroup] = useState(false)

    const loadInGoing = async () => {
        let res = await fetch(`${process.env.EVENT_URL}/event/get/all/player/in-going`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let data = await res.json()
        if (data.status == 200)
            setIngoing(data.data)
        else
            console.log(data, 'ingoing');

    }
    const loadExpired = async () => {
        let res = await fetch(`${process.env.EVENT_URL}/event/get/all/player/done`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let data = await res.json()
        if (data.status == 200)
            setExpired(data.data)
        else
            console.log(data, 'exp');

    }
    const loadGodEvents = async () => {
        let res = await fetch(`${process.env.GAME_URL}/event/get/all/god`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
        })
        let data = await res.json()
        if (data.status == 200)
            setGodEvents(data.data.reverse())
        if (data.status == 404)
            setGodEvents([])

    }
    const loadGroups = async () => {
        let res = await fetch(`${process.env.GAME_URL}/game/god/get/group/all`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
            body: JSON.stringify({ "_id": globalUser.user_id })
        })
        let data = await res.json()
        if (data.status == 200)
            setGroups(data.data.groups)

    }


    useEffect(() => {
        if (globalUser && globalUser.isLoggedIn && (globalUser.access_level === 2)) {
            loadExpired()
            loadInGoing()
        }
        if (globalUser && globalUser.isLoggedIn && (globalUser.access_level === 1 || globalUser.access_level === 0)) {
            loadGroups()
            loadGodEvents()
        }

    }, [globalUser])
    useEffect(() => {
        if (globalUser.access_level === 1 || globalUser.access_level === 0) {
            canCreateGroupHandler()
            if (godEvents && groups)
                setLoading(false)
        }
        else {
            // if (expired && ingoing && groups)
            setUsername(globalUser.username)
            if (expired && ingoing)
                setLoading(false)
        }
    }, [expired, ingoing, godEvents, groups])

    /**
     * Changing the state of panels when clicking on navigation items.
     * @version 1.0
     */
    // useEffect(() => {
    const tabSelect = (e) => {
        e.preventDefault()
        let TabItems = document.querySelectorAll(`.${styles.navigation} ul li`)
        let Tabs = document.querySelectorAll(`.${styles.tabs} > div`)

        TabItems.forEach(item => {

            item.addEventListener('click', function () {
                if (item.classList.contains(styles.active)) return

                let target = item.getAttribute('data-target')

                TabItems.forEach(li => li.classList.remove(styles.active))
                item.classList.add(styles.active)

                Tabs.forEach(div => div.classList.remove(styles.active))
                document.querySelector(target).classList.add(styles.active)
            })

        })
    }
    // }, [])

    /**
     * Checking whether the user has the ability to create a group or not.
     * @version 1.0
     * @returns {boolean}
     * @constructor
     */
    // const CanCreateGroup = () => { if (groups) groups.filter(g => g.owner === globalUser.username).length <= 0 }
    const canCreateGroupHandler = () => {
        if (groups) {
            console.log(groups.length)
            if (groups.length == 0) setCanCreateGroup(true)
            else setCanCreateGroup(false)
            for (let t = 0; t < groups.length; t++) {
                if (groups[t].god_id == globalUser.user_id)
                    setCanCreateGroup(false)
                else setCanCreateGroup(true)
            }
        }
        console.log(CanCreateGroup)
    }

    /**
     * Set group name
     * @version 1.0
     */
    const [GroupName, SetGroupName] = useState('')
    useEffect(() => {
        if (groups) {
            console.log(">??>>>>>>>>>>>>>> darim", groups)
            let group = groups.filter(g => g.god_id === globalUser.user_id)
            if (group.length > 0) {
                SetGroupName(group.at(-1).name)
            }
        } else {

        }
    }, [groups, globalUser])

    /**
     * Submit group
     * @version 1.0
     * @param e
     * @returns {Promise<void>}
     * @constructor
     */
    const SubmitGroup = async e => {
        e.preventDefault()

        let form = e.target,
            name = form.querySelector('#name'),
            submit = form.querySelector('button[type="submit"]'),
            // { _id, username } = globalUser
            username = globalUser.username

        submit.setAttribute('disabled', 'disabled')
        name.setAttribute('disabled', 'disabled')

        if (name.value === '') {
            submit.removeAttribute('disabled')
            toast.warning('نام گروه نمیتواند خالی باشد')
            return
        }

        let response = await fetch(`${process.env.GAME_URL}/game/god/create/group`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
            body: JSON.stringify({
                "name": name.value,
                "owner": username,
                "god_id": globalUser.user_id
            })
        })
        let { status } = await response.json()

        if (status === 201) {
            toast.success('گروه با موفقیت ثبت شد')
            submit.remove()
        } else {
            toast.error('خطایی در هنگام ثبت گروه بوجود آمده، لطفا دوباره تلاش کنید')
            submit.removeAttribute('disabled')
        }
    }

    const SubmitUsername = async e => {
        e.preventDefault()

        let form = e.target,
            submit = form.querySelector('button[type="submit"]')

        let errors = 0
        if (username === '') {
            errors++
            toast.error('نام و نام خانوادگی نمیتواند خالی باشد')
        } else if (username.match(/^[a-zA-Z]|[\u0600-\u06FF\s]+$/) === null) {
            errors++
            toast.error('برای نام و نام خانوادگی تنها حروف مجاز است')
        }
        // Send request to server if there is no errors
        if (errors === 0) {
            let response = await fetch(`${process.env.AUTH_URL}/auth/edit-profile`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
                body: JSON.stringify({
                    "username": username.toLocaleLowerCase(),
                    "phone": globalUser.phone_number,
                })
            })
            let res = await response.json()
            let { status } = res;

            console.log(res);
            if (status === 200) {
                const prev = JSON.parse(localStorage.getItem("loginresp"))
                const newData = { ...prev, data:{...prev.data, username: username.toLocaleLowerCase()} }
                localStorage.setItem('loginresp', JSON.stringify(newData))
                toast.success('نام و نام خوانوادگی شما با موفقیت ثبت شد')
                router.reload();
            } else {
                toast.error('خطایی در هنگام ثبت نام کاربری شما بوجود آمده، لطفا دوباره تلاش کنید')
                submit.removeAttribute('disabled')
            }
        }
    }



    return (
        <div className={styles.page}>

            <Head>
                <title>حساب کاربری {globalUser.username}</title>
            </Head>

            <Header user={globalUser} />

            <Nav user={globalUser} />

            {
                !globalUser.isLoggedIn ?
                    <div className="container">
                        <Alert type={"warning"}>
                            شما اجازه دسترسی به این صفحه را ندارید لطفا وارد حساب کاربری خود شوید
                        </Alert>
                    </div> :
                    <>
                        {loading ?
                            <div className='container'><Circular /></div>
                            :
                            <>
                                <div className="container" style={{ padding: 0 }}>
                                    <div className={styles.navigation}>
                                        <ul>
                                            {
                                                (globalUser.access_level == 2) &&
                                                <>
                                                    <li className={styles.active} data-target={"#reserves"}>رزرو های من</li>
                                                    <li data-target={"#history"} onClick={tabSelect}>پایان یافته</li>
                                                    <li data-target={"#username"} onClick={tabSelect}>نام کاربری</li>
                                                </>
                                            }

                                            {
                                                (globalUser.access_level == 1 || globalUser.access_level == 0) &&
                                                <>
                                                    <li className={styles.active} data-target={"#god-events"}>ایونت های من</li>
                                                    <li data-target={"#group"} onClick={tabSelect}>گروه من</li>
                                                </>
                                            }
                                        </ul>
                                    </div>

                                    <div className={styles.tabs}>

                                        {
                                            (globalUser.access_level == 2) &&
                                            <>
                                                <div id={"reserves"} className={`${styles.active} ${styles.reserves}`}>
                                                    {ingoing && ingoing.length > 0 ?
                                                        <ul>
                                                            {ingoing.map(event => {
                                                                const startTime = new DateObject({
                                                                    date: event.started_at * 1000,
                                                                    calendar: persian,
                                                                    locale: persian_fa,
                                                                })
                                                                return (
                                                                    <li key={event._id.$oid} className={styles.full}>
                                                                        <Link href={`/events/${event._id.$oid}`}>
                                                                            <a className={`${styles.item}`} style={{ backgroundImage: `url("/e3.jpg")` }}>
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

                                                                                <button className={styles.btn}>بیشتر</button>

                                                                            </a>
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul> :
                                                        <Alert>
                                                            بازی رزروی وجود ندارد
                                                        </Alert>
                                                    }

                                                </div>

                                                <div id={"username"} className={styles.username}>
                                                    <div className={"page-title"}>
                                                        <h2>مشخصات شما</h2>
                                                    </div>

                                                    <form onSubmit={SubmitUsername} className={"submit-form"}>
                                                        <div className="row">
                                                            <label htmlFor="username">نام و نام خانوادگی</label>
                                                            <input value={username} onChange={e => setUsername(e.target.value)} type="text" id={"username"} />
                                                        </div>

                                                        <div className="row">
                                                            <button type={"submit"}>ثبت</button>
                                                        </div>
                                                    </form>

                                                    <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

                                                </div>

                                                <div id={"history"} className={styles.history}>
                                                    {
                                                        expired && expired.length > 0 ?
                                                            <ul>
                                                                {expired.map(event => {
                                                                    return (
                                                                        <li key={event._id.$oid} className={styles.full}>
                                                                            <Link href={`/events/${event._id.$oid}`}>
                                                                                <a className={`${styles.item} ${styles.expired}`} style={{ backgroundImage: `url("/e3.jpg")` }}>
                                                                                    <div className={styles.data}>
                                                                                        <div className={styles.event_title}>
                                                                                            <FaMapMarkerAlt />
                                                                                            <h3>
                                                                                                {event.title}
                                                                                            </h3>
                                                                                        </div>
                                                                                    </div>

                                                                                </a>
                                                                            </Link>
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul> :
                                                            <Alert>
                                                                تاریخچه ای وجود ندارد
                                                            </Alert>
                                                    }
                                                </div>
                                            </>
                                        }
                                        {
                                            (globalUser.access_level == 1 || globalUser.access_level == 0) &&
                                            <>
                                                <div id={"group"} className={styles.group}>
                                                    {CanCreateGroup ?
                                                        <>
                                                            <div className={"page-title"}>
                                                                <h2>ثبت گروه</h2>
                                                            </div>

                                                            <Alert type={'warning'}>
                                                                توجه داشته باشید، در صورت ثبت گروه دیگر قادر به تغییر نام آن نمیباشید، لذا
                                                                برای تغییر آن باید درخواست خود را ثبت کنید تا پس از بررسی تغییر نام گروه
                                                                برای شما انجام شود، پس با دقت نام گروه خود را انتخاب کنید
                                                            </Alert>

                                                            <form onSubmit={SubmitGroup} className={"submit-form"}>
                                                                <div className="row">
                                                                    <label htmlFor="name">نام گروه</label>
                                                                    <input type="text" id={"name"} />
                                                                </div>

                                                                <div className="row">
                                                                    <button type={"submit"}>ثبت گروه</button>
                                                                </div>
                                                            </form>

                                                            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

                                                        </> : <>
                                                            <div className={"page-title"}>
                                                                <h2>گروه شما</h2>
                                                            </div>

                                                            <Alert type={"info"}>
                                                                شما نام گروه خود را انتخاب کردید برای تغییر به پشتیبانی درخواست دهید
                                                            </Alert>

                                                            <form onSubmit={SubmitGroup} className={"submit-form"}>
                                                                <div className="row">
                                                                    <label htmlFor="name_temp">نام گروه</label>
                                                                    <input type="text" id={"name_temp"} disabled={true} value={GroupName} />
                                                                </div>
                                                            </form>
                                                        </>}
                                                </div>

                                                <div id={"god-events"} className={`${styles.active} ${styles.god_events}`}>

                                                    {godEvents.length > 0 ?
                                                        <ul>
                                                            {godEvents.map(event => {
                                                                const startTime = new DateObject({
                                                                    date: event.started_at * 1000,
                                                                    calendar: persian,
                                                                    locale: persian_fa,
                                                                })
                                                                return (
                                                                    <li key={event._id.$oid} className={styles.full}>
                                                                        <Link href={`/events/${event._id.$oid}`}>
                                                                            <a className={`${styles.item} ${event.is_expired ? styles.expired : ''}`} style={{ backgroundImage: `url("/e3.jpg")` }}>
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

                                                                                <button className={styles.btn}>بیشتر</button>

                                                                            </a>
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul> :
                                                        <Alert>
                                                            ایونتی وجود ندارد
                                                        </Alert>
                                                    }

                                                </div>
                                            </>
                                        }




                                    </div>
                                </div>
                            </>}
                    </>
            }

        </div>
    )
}


export default Profile