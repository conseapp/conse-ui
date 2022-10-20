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
    console.log(globalUser)



    /**
     * Get props of this page
     * @version 1.0
     * @var user, groups
     */
    const { groups, ingoing, expired } = props

    /**
     * Changing the state of panels when clicking on navigation items.
     * @version 1.0
     */
    useEffect(() => {
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

    }, [])

    /**
     * Checking whether the user has the ability to create a group or not.
     * @version 1.0
     * @returns {boolean}
     * @constructor
     */
    const CanCreateGroup = () => groups.filter(g => g.owner === globalUser.username).length <= 0

    /**
     * Set group name
     * @version 1.0
     */
    const [GroupName, SetGroupName] = useState('')
    useEffect(() => {
        let group = groups.filter(g => g.owner === globalUser.username)
        if (group.length > 0) {
            SetGroupName(group.at(-1).name)
        }
    }, [groups, globalUser.username])

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
            { _id, username } = user

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
                "god_id": _id.$oid
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
                    <div className="container" style={{ padding: 0 }}>
                        <div className={styles.navigation}>
                            <ul>
                                <li className={styles.active} data-target={"#reserves"}>رزرو های من</li>

                                <li data-target={"#history"}>تاریخچه</li>

                                {globalUser.access_level !== 2 && <li data-target={"#group"}>گروه من</li>}
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
                                {globalUser.access_level !== 2 && CanCreateGroup === true ?
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
    // Check user
    // let user = (typeof context.req.cookies['token'] !== 'undefined') ? await checkToken(context.req.cookies['token']) : {}

    // Get all groups
    let groups = await fetch(`${process.env.GAME_URL}/game/get/group/all`)
    groups = await groups.json()

    // Get all player ingoing events
    let ingoing = await fetch(`${process.env.EVENT_URL}/event/get/all/player/in-going`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
    })
    ingoing = await ingoing.json()

    // Get all player ingoing events
    let expired = await fetch(`${process.env.EVENT_URL}/event/get/all/player/done`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
    })
    expired = await expired.json()

    return {
        props: {
            groups: groups.data.groups,
            ingoing: ingoing.data,
            expired: expired.data,
            // user: user
        }
    }
}

export default Profile