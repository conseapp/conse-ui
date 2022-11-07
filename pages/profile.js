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
    console.log("dddddddddddd", user)

    const [ingoing, setIngoing] = useState(undefined)
    const [expired, setExpired] = useState(undefined)
    const [groups, setGroups] = useState(undefined)
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

    }
    const loadExpired = async () => {
        let res = await fetch(`${process.env.EVENT_URL}/event/get/all/player/done`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let data = await res.json()
        if (data.status == 200)
            setExpired(data.data)

    }
    const loadGroups = async () => {
        let res = await fetch(`${process.env.GAME_URL}/game/god/get/group/all`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
            body: JSON.stringify({ "_id": globalUser.user_id })
        })
        let data = await res.json()
        console.log('groups', data)
        if (data.status == 200)
            setGroups(data.data.groups)

    }


    useEffect(() => {
        if (globalUser && globalUser.isLoggedIn) {
            loadExpired()
            loadInGoing()
            loadGroups()
            canCreateGroupHandler()
        }
    }, [globalUser])
    useEffect(() => {
        if (expired && ingoing && groups)
            setLoading(false)
    }, [expired, ingoing, groups])
    /**
     * Get props of this page
     * @version 1.0
     * @var user, groups
     */
    // const { groups, ingoing, expired } = props
    const { groupss } = props
    console.log('groupss,,,,,,,,,,,,', groupss)

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
            let group = groups.filter(g => g.owner === globalUser.username)
            if (group.length > 0) {
                SetGroupName(group.at(-1).name)
            }
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
                                            <li className={styles.active} data-target={"#reserves"}>رزرو های من</li>

                                            <li data-target={"#history"} onClick={tabSelect}>تاریخچه</li>

                                            {globalUser.access_level !== 2 && <li data-target={"#group"} onClick={tabSelect}>گروه من</li>}
                                        </ul>
                                    </div>

                                    <div className={styles.tabs}>

                                        <div id={"reserves"} className={`${styles.active} ${styles.reserves}`}>
                                            {ingoing.length > 0 ?
                                                <ul>
                                                    {ingoing.map(event => {
                                                        return (
                                                            <li key={event._id.$oid}>
                                                                <Link href={`/events/${event._id.$oid}`}>
                                                                    <a style={{ backgroundImage: 'url(/events-slide-2.png)' }}>
                                                                        <h3>
                                                                            {event.title}
                                                                        </h3>
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

                                        <div id={"history"} className={styles.history}>
                                            {
                                                expired.length > 0 ?
                                                    <ul>
                                                        {expired.map(event => {
                                                            return (
                                                                <li key={event._id.$oid}>
                                                                    <Link href={`/events/${event._id.$oid}`}>
                                                                        <a style={{ backgroundImage: 'url(/events-slide-2.png)' }}>
                                                                            <h3>
                                                                                {event.title}
                                                                            </h3>
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
                                    </div>
                                </div>
                            </>}
                    </>
            }

        </div>
    )
}

/**
 * @link https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
 * @param context
 * @returns {Promise<{props: {expired, ingoing, groups: *, user: any}}>}
 */
export async function getServerSideProps(context) {
    //     // Check user
    //     // let user = (typeof context.req.cookies['token'] !== 'undefined') ? await checkToken(context.req.cookies['token']) : {}

    //     // Get all groups
    let groups = await fetch(`${process.env.GAME_URL}/game/get/group/all`)
    groups = await groups.json()

    //     // // Get all player ingoing events
    //     // let ingoing = await fetch(`${process.env.EVENT_URL}/event/get/all/player/in-going`, {
    //     //     method: "POST",
    //     //     headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
    //     // })
    //     // ingoing = await ingoing.json()

    //     // // Get all player ingoing events
    //     // let expired = await fetch(`${process.env.EVENT_URL}/event/get/all/player/done`, {
    //     //     method: "POST",
    //     //     headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
    //     // })
    //     // expired = await expired.json()

    return {
        props: {
            groupss: groups.data.groups,
            //             // ingoing: ingoing.data,
            //             // expired: expired.data,
            //             // user: user
        }
    }
}

export default Profile