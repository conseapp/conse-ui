import styles from "/styles/pages/conductor/event/create.module.scss";
import Head from "next/head";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import Link from "next/link";
import { getCookie } from "cookies-next";
import checkToken from "../../../../utils/checkToken";
import Nav from "../../../../components/nav";
import Header from "../../../../components/header";
import createEvent from "../../../../utils/createEvent";
import { useSelector } from "react-redux";
import Circular from "../../../../components/Circular";
import DateObject from "react-date-object";
import DateInput from "../../../../components/DateInput";

const Create = props => {
    const Router = useRouter()
    const { query } = Router

    const { globalUser } = useSelector(state => state.userReducer)
    const [loading, setLoading] = useState(true)
    const [groups, setGroups] = useState(undefined)
    const [decks, setDecks] = useState(undefined)
    useEffect(() => {
        if (globalUser.accessToken)
            loadPage()
        else {
            toast.error("وارد حساب کاربری خود شوید")
            setTimeout(() => {
                Router.push('/mafia/login')
            }, 2000)
        }
    }, [globalUser])
    const loadPage = async () => {
        let groups = await fetch(`${process.env.GAME_URL}/game/god/get/group/all`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
            body: JSON.stringify({ "_id": globalUser.user_id })
        })
        let groupsData = await groups.json()
        if (groupsData.status == 200)
            setGroups(groupsData.data.groups)

        // Get available decks
        let decks = await fetch(`${process.env.GAME_URL}/game/deck/get/availables`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let decksData = await decks.json()
        if (decksData.status == 200)
            setDecks(decksData.data.decks.reverse())

    }
    useEffect(() => {
        if (groups && decks)
            setLoading(false)
    }, [groups, decks])
    /**
     * User next.js router.
     * @version 1.0
     */

    /**
     * Get all props of this page.
     * @version 1.0
     */
    // const { user, groups, decks } = props

    /**
     * Submit start_at
     */
    const [startDate, setStartDate] = useState(new DateObject())

    /**
     * Change the style of the dropdown list.
     * @version 1.0
     * @type {{control: (function(*, *): *&{border: string, backgroundColor: string, borderRadius: string}), multiValue: (function(*, *): *&{border: string, paddingRight: string}), option: (function(*, *): *&{cursor: string, "&:hover": {}})}}
     */
    const SelectStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#a688fa' : '#282828',
            color: (state.isFocused) ? '#121212' : '#ffffffdd',
            cursor: 'pointer'
        }),
        control: (provided) => ({
            ...provided,
            backgroundColor: '#282828',
            border: 'none',
            borderRadius: '8px'
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: '#ffffffdd',

        }),
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: '#282828'
        }),

    }

    /**
     * Config decks options
     */
    const [DeckOptions, SetDeckOptions] = useState([])
    const [DeckValue, SetDeckValue] = useState('')
    useEffect(() => {
        if (decks) {
            let options = [];

            decks.map(option => {
                options.push({
                    label: option.deck_name,
                    value: JSON.stringify(option)
                })
            })

            SetDeckOptions(options)
        }
    }, [decks])

    /**
     * Submit Event
     * @param e
     * @returns {Promise<void>}
     * @constructor
     */
    const SubmitEvent = async e => {
        e.preventDefault()

        if (groups.length == 0) {
            toast.error('برای ساخت ایونت باید گروه داشته باشید')
            return
        }
        // Form Element
        let form = e.target,
            title = form.querySelector('#title'),
            content = form.querySelector('#content'),
            button = form.querySelector('button[type="submit"]')

        // Access token
        // let token = getCookie('token')
        let token = globalUser.accessToken

        // Disable submit button
        button.setAttribute('disabled', 'disabled')

        let deck = JSON.parse(DeckValue)

        let group_info = groups.at(-1)
        if (group_info)
            group_info._id = group_info._id.$oid

        let body = {
            "title": title.value,
            "content": content.value,
            "deck_id": deck._id.$oid,
            "entry_price": '0',
            "group_info": group_info,
            "creator_wallet_address": "0x0000000000000000000000000000000000000000",
            "upvotes": 0,
            "downvotes": 0,
            "voters": [],
            "phases": [],
            "max_players": deck.roles.length,
            "players": [],
            "started_at": startDate.add(5, "minute").unix
        }

        let { status } = await createEvent(body, token)


        if (status === 201 || status === 302) {
            toast.success('ایونت با موفقیت ایجاد شد')
            setTimeout(() => Router.push('/mafia/conductor/event/'), 2000)
        } else {
            toast.error('خطایی در هنگام ایجاد ایونت بوجود آمده')
            button.removeAttribute('disabled')
        }
    }

    const onChangeHandler = value => setStartDate(value)

    return (
        <div className={styles.page}>

            <Head>
                <title>افزودن ایونت</title>
            </Head>

            <Header user={globalUser} />

            <Nav user={globalUser} />

            {globalUser.isLoggedIn && (globalUser.access_level == 0 || globalUser.access_level == 1) ? <>
                {loading ? <><div><Circular /></div></> : <>
                    <div className="container">

                        <div className="page-title">
                            <h2>افزودن ایونت</h2>
                            <Link href={'/mafia/conductor/event'}>
                                <a>
                                    بازگشت
                                </a>
                            </Link>
                        </div>

                        <form onSubmit={SubmitEvent} className={"submit-form"}>

                            <div className="row">
                                <label htmlFor="title">نام ایونت</label>
                                <input type="text" id={"title"} />
                            </div>

                            <div className="row">
                                <label htmlFor="content">توضیحات</label>
                                <textarea id={"content"} rows={8}></textarea>
                            </div>

                            <div className="row">
                                <label htmlFor="deck">انتخاب دک بازی</label>
                                <Select menuPlacement="auto" minMenuHeight={300} placeholder={'انتخاب کنید'} styles={SelectStyles} options={DeckOptions} id={"deck"} isRtl={true} onChange={e => {
                                    SetDeckValue(e.value)
                                }} />
                            </div>

                            <div className="row">
                                <label htmlFor="started_at">زمان شروع بازی</label>
                                <DateInput onChange={onChangeHandler} value={startDate} />
                            </div>

                            <div className="row">
                                <button type={"submit"}>ثبت ایونت</button>
                            </div>

                        </form>

                    </div>
                </>}</> : <div className="container">
                سطح دسترسی ندارید
            </div>}

            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

/**
 * @link https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
 * @param context
 * @returns {Promise<{props: {roles: *, sides: *, user: any}}>}
 */
// export async function getServerSideProps(context) {
//     // Check user
//     // let user = (typeof context.req.cookies['token'] !== 'undefined') ? await checkToken(context.req.cookies['token']) : {}

//     // Get available groups
//     let groups = await fetch(`${process.env.GAME_URL}/game/god/get/group/all`, {
//         method: 'POST',
//         headers: { "Authorization": `Bearer ${context.req.cookies['token']}` },
//         body: JSON.stringify({ "_id": user._id.$oid })
//     })
//     groups = await groups.json()

//     // Get available decks
//     let decks = await fetch(`${process.env.GAME_URL}/game/deck/get/availables`, {
//         method: 'GET',
//         headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
//     })
//     decks = await decks.json()

//     return {
//         props: {
//             groups: groups.data.groups,
//             decks: decks.data.decks,
//             user: user
//         }
//     }
// }

export default Create