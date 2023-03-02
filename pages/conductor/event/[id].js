import styles from "/styles/pages/conductor/event/create.module.scss";
import Head from "next/head";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import Link from "next/link";
import { getCookie } from "cookies-next";
import checkToken from "../../../utils/checkToken";
import Nav from "../../../components/nav";
import Header from "../../../components/header";
import { DatePicker } from "jalali-react-datepicker";
import createEvent from "../../../utils/createEvent";
import { useSelector } from "react-redux";
import Circular from "../../../components/Circular";

const Create = props => {
    /**
     * User next.js router.
     * @version 1.0
     */
    const Router = useRouter()

    const { query } = Router

    const { globalUser } = useSelector(state => state.userReducer)
    const [loading, setLoading] = useState(true)
    const [event, setEvent] = useState(undefined)
    const [groups, setGroups] = useState(undefined)
    const [decks, setDecks] = useState(undefined)
    const [deckName, setDeckName] = useState(undefined)
    useEffect(() => {
        if (globalUser.accessToken)
            loadPage()
        else {
            toast.error("وارد حساب کاربری خود شوید")
            setTimeout(() => {
                Router.push('/')
            }, 2000)
        }
    }, [globalUser])
    const loadPage = async () => {
        let event = await fetch(`${process.env.GAME_URL}/event/get/single/${query.id}/god`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let eventData = await event.json()
        console.log("eventData", eventData)
        if (eventData.status == 200)
            setEvent(eventData.data)
        // Get available groups
        let groups = await fetch(`${process.env.GAME_URL}/game/god/get/group/all`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
            body: JSON.stringify({ "_id": globalUser.user_id })
        })
        let groupsData = await groups.json()
        if (groupsData.status == 200) {
            setGroups(groupsData.data.groups)
        }
        // Get available decks
        let decks = await fetch(`${process.env.GAME_URL}/game/deck/get/availables`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` }
        })
        let decksData = await decks.json()
        if (decksData.status == 200)
            setDecks(decksData.data.decks)

    }
    //set deck info from the event
    useEffect(() => {
        if (groups && event && decks) {
            // setStartDate(Math.floor(new Date(event.started_at * 1000).getTime()) / 1000)
            setStartDate(event.started_at * 1000)
            for (var t = 0; t < decks.length; t++) {
                if (decks[t]._id.$oid == event.deck_id) {
                    SetDeckValue(JSON.stringify(decks[t]))
                    setDeckName(decks[t].deck_name)
                }
            }
        }
    }, [groups, event, decks])
    useEffect(() => {
        if (deckName && startDate && DeckValue)
            setLoading(false)
    }, [deckName, startDate, DeckValue])


    /**
     * Get all props of this page.
     * @version 1.0
     */
    // const { user, groups, decks, event } = props

    /**
     * Submit start_at
     */
    const [startDate, setStartDate] = useState(undefined)

    /**
     * Change the style of the dropdown list.
     * @version 1.0
     * @type {{control: (function(*, *): *&{border: string, backgroundColor: string, borderRadius: string}), multiValue: (function(*, *): *&{border: string, paddingRight: string}), option: (function(*, *): *&{cursor: string, "&:hover": {}})}}
     */
    const SelectStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#E5E5E5',
            border: 'none',
            borderRadius: '8px'
        }),
        multiValue: (provided) => ({
            ...provided,
            paddingRight: '4px',
            border: '1px solid #CCC'
        })
    }

    /**
     * Config decks options
     */
    const [DeckOptions, SetDeckOptions] = useState([])
    const [DeckValue, SetDeckValue] = useState(undefined)
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
        let deck;
        if (DeckValue)
            deck = JSON.parse(DeckValue)
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
            "started_at": startDate
        }
        let { status, message } = await createEvent(body, token)
        if (status === 201 || status === 302) {
            toast.success('ایونت با موفقیت ایجاد شد')
            setTimeout(() => Router.push('/conductor/event/'), 2000)
        } else {
            toast.error('خطایی در هنگام ایجاد ایونت بوجود آمده')
            button.removeAttribute('disabled')
        }
    }


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
                            <h2>ویرایش ایونت</h2>
                            <Link href={'/conductor/event'}>
                                <a>
                                    بازگشت
                                </a>
                            </Link>
                        </div>

                        <form onSubmit={SubmitEvent} className={"submit-form"}>

                            <div className="row">
                                <label htmlFor="title">نام ایونت</label>
                                <input type="text" id={"title"} value={event.title} readOnly={true} />
                            </div>

                            <div className="row">
                                <label htmlFor="content">توضیحات</label>
                                <textarea id={"content"} rows={8} defaultValue={event.content}></textarea>
                            </div>

                            <div className="row">
                                <label htmlFor="deck">انتخاب دک بازی</label>
                                <Select placeholder={deckName} styles={SelectStyles} options={DeckOptions} id={"deck"} isRtl={true} onChange={e => {
                                    SetDeckValue(e.value)
                                }} />
                            </div>

                            <div className="row">
                                <label htmlFor="started_at">زمان شروع بازی</label>
                                <DatePicker value={startDate} onClickSubmitButton={({ value }) => {
                                    let date = new Date(value._d).getTime()
                                    setStartDate(Math.floor(date / 1000))
                                }} />
                            </div>

                            <div className="row">
                                <button type={"submit"}>ویرایش ایونت</button>
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
// Check user
// let user = (typeof context.req.cookies['token'] !== 'undefined') ? await checkToken(context.req.cookies['token']) : {}

// Get available groups
// let event = await fetch(`${process.env.GAME_URL}/event/get/single/${context.query.id}/god`, {
//     method: 'POST',
//     headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
// })
// event = await event.json()

// // Get available groups
// let groups = await fetch(`${process.env.GAME_URL}/game/god/get/group/all`, {
//     method: 'POST',
//     headers: { "Authorization": `Bearer ${context.req.cookies['token']}` },
//     body: JSON.stringify({ "_id": user._id.$oid })
// })
// groups = await groups.json()

// // Get available decks
// let decks = await fetch(`${process.env.GAME_URL}/game/deck/get/availables`, {
//     method: 'GET',
//     headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
// })
// decks = await decks.json()

// return {
//     props: {
// event: event.data,
// groups: groups.data.groups,
// decks: decks.data.decks,
// user: user
//         }
//     }
// }

export default Create