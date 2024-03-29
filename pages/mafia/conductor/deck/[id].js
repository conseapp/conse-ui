import styles from "/styles/pages/conductor/deck/create.module.scss";
import Head from "next/head";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import Link from "next/link";
import CreateSideColor from "../../../../utils/createSideColor";
import checkToken from "../../../../utils/checkToken";
import Header from "../../../../components/header";
import Nav from "../../../../components/nav";
import { getCookie } from "cookies-next";
import CreateDeck from "../../../../utils/createDeck";
import { useSelector } from "react-redux";
import Circular from "../../../../components/Circular";

const Edit = props => {

    const { globalUser } = useSelector(state => state.userReducer)

    const [sides, setSides] = useState(undefined)
    const [roles, setRoles] = useState(undefined)
    const [cards, setCards] = useState(undefined)
    const [deck, setDeck] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [err, setErr] = useState(undefined)

    const loadSides = async () => {
        const res = await fetch(`${process.env.GAME_URL}/game/side/get/availables`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${globalUser.accessToken}`
            }
        })
        const data = await res.json()
        if (data.status == 200)
            setSides(data.data.sides)

        console.log(data)
        // return data
    }
    const loadRoles = async () => {
        const res = await fetch(`${process.env.GAME_URL}/game/role/get/availables`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${globalUser.accessToken}`
            }
        })
        const data = await res.json()
        console.log("-----", data)
        if (data.status == 200)
            setRoles(data.data.roles)
        console.log(data)
        // return data
    }
    const loadCards = async () => {
        const res = await fetch(`${process.env.GAME_URL}/game/last-move/get/availables`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${globalUser.accessToken}`
            }
        })
        const data = await res.json()
        if (data.status == 200)
            setCards(data.data)
        console.log(data)
        // return data
    }
    const loadDeck = async () => {
        let res = await fetch(`${process.env.GAME_URL}/game/deck/get/single`, {
            method: 'POST',
            headers: { "Authorization": `Bearer ${globalUser.accessToken}` },
            body: JSON.stringify({ _id: query.id })
        })
        let data = await res.json()
        console.log(data)
        if (data.status == 200)
            setDeck(data.data)
        else if (data.status == 403)
            setErr("شما مجاز به ورود به این صفحه نیستید")
        else
            setErr(data.message)
        console.log(data)
        // return data
    }
    useEffect(() => {
        loadSides()
        loadRoles()
        loadCards()
        loadDeck()
    }, [])
    useEffect(() => {
        if (sides && roles && cards && deck)
            setLoading(false)
    }, [sides, roles, cards, deck])


    /**
     * User next.js router.
     * @version 1.0
     */
    const router = useRouter()
    const { query } = router

    /**
     * Get all props of this page.
     * @version 1.0
     */
    // const { user, sides, roles, cards, deck } = props

    /**
     * Create drop down menu options.
     * @version 1.0
     */
    const [roleOptions, setRoleOptions] = useState([])
    /**
     * Set options of select box.
     * @version 1.0
     */
    useEffect(() => {
        if (roles && sides) {

            let groups = []
            sides.forEach(side => {

                let options = []
                roles.filter(role => {
                    if (role.side_id.$oid === side._id.$oid) {
                        options.push({
                            label: role.name,
                            value: JSON.stringify(role)
                        })
                    }
                })

                groups.push({ label: side.name, options: options })
            })

            setRoleOptions(groups)
        }
    }, [roles, sides])

    const [defaultRoles, setDefaultRoles] = useState([])
    useEffect(() => {
        if (deck && roles && sides) {
            let options = []
            deck.roles.filter(role => {
                options.push({
                    label: role.name,
                    value: JSON.stringify(role)
                })
            })
            setDefaultRoles(options)
        }
    }, [deck, roles, sides])
    /**
     * Registering the selected roles in the corresponding variable.
     * @version 1.0
     * @param options
     * @constructor
     */
    const changeRoles = options => setDefaultRoles(options)

    /**
     * Create drop down menu options.
     * @version 1.0
     */
    const [cardOptions, setCardOptions] = useState([])
    /**
     * Set options of select box.
     * @version 1.0
     */
    useEffect(() => {
        if (cards) {
            let options = []
            cards.filter(card => {
                options.push({
                    label: card.name,
                    value: JSON.stringify(card)
                })
            })

            setCardOptions(options)
        }
    }, [cards])

    /**
     * Selected roles.
     * @version 1.0
     */
    const [defaultCards, setDefaultCards] = useState([])
    useEffect(() => {
        if (deck) {
            let options = []

            deck.last_move_cards.filter(card => {
                options.push({
                    label: card.name,
                    value: JSON.stringify(card)
                })
            })

            setDefaultCards(options)
        }
    }, [deck])
    /**
     * Registering the selected roles in the corresponding variable.
     * @version 1.0
     * @param options
     * @constructor
     */
    const changeCards = options => setDefaultCards(options)

    /**
     * Submit deck
     * @version 1.0
     * @param e
     * @returns {Promise<void>}
     * @constructor
     */
    const insertDeck = async e => {
        e.preventDefault()

        // Variables
        let form = e.target,
            title = form.querySelector('#title'),
            button = form.querySelector('button')

        // Roles
        let roles = []

        // Cards
        let cards = []

        // Access token
        // let token = getCookie( 'token' )
        let token = globalUser.accessToken


        // Disable submit button
        button.setAttribute('disabled', 'disabled')
        let prevRoles = JSON.stringify(deck.roles)
        let prevCards = JSON.stringify(deck.last_move_cards)
        defaultRoles.forEach(role => {
            let {
                _id,
                name,
                rate,
                desc,
                abilities,
                side_id,
                is_disabled,
                created_at,
                updated_at
            } = JSON.parse(role.value)
            if (prevRoles.includes(role.value)) {
                roles.push({
                    "_id": _id,
                    "name": name,
                    "rate": rate,
                    "desc": desc,
                    "abilities": abilities,
                    "side_id": side_id,
                    "is_disabled": is_disabled,
                    "created_at": created_at,
                    "updated_at": updated_at
                })
            } else {
                roles.push({
                    "_id": _id.$oid,
                    "name": name,
                    "rate": rate,
                    "desc": desc,
                    "abilities": abilities,
                    "side_id": side_id.$oid,
                    "is_disabled": is_disabled,
                    "created_at": created_at,
                    "updated_at": updated_at
                })
            }
        })

        defaultCards.forEach(card => {
            let {
                _id,
                name,
                rate,
                desc,
                is_disabled,
                created_at,
                updated_at
            } = JSON.parse(card.value)
            if (prevCards.includes(card.value)) {
                cards.push({
                    "_id": _id,
                    "name": name,
                    "rate": rate,
                    "desc": desc,
                    "is_disabled": is_disabled,
                    "created_at": created_at,
                    "updated_at": updated_at
                })
            } else {
                cards.push({
                    "_id": _id.$oid,
                    "name": name,
                    "rate": rate,
                    "desc": desc,
                    "is_disabled": is_disabled,
                    "created_at": created_at,
                    "updated_at": updated_at
                })
            }
        })

        console.log(roles)
        console.log(cards)

        let { status, message } = await CreateDeck(title.value, roles, cards, token, router.query.id)
        console.log(message)
        if (status) {
            console.log(status)

            button.removeAttribute('disabled')

            if (status === 201 || status === 302) {
                toast.success('دک با موفقیت ویرایش شد')

                setTimeout(() => router.push('/mafia/conductor/deck/'), 2000)
            } else {
                toast.error('خطایی در هنگام ویرایش دک بوجود آمده')
                button.removeAttribute('disabled')
            }
        }
    }

    const roleSelectStyles = {
        option: (provided, state) => {
            let { side_id } = JSON.parse(state.value)
            return {
                ...provided,
                backgroundColor:state.isFocused ? CreateSideColor(side_id.$oid).background  :  '#282828',
                color:state.isFocused ? CreateSideColor(side_id.$oid).color  :  CreateSideColor(side_id.$oid).background,
                cursor: 'pointer'
            }
        },
        control: (provided, state) => {
            return {
                ...provided,
                backgroundColor: '#3f3f3f',
                border: 'none',
                borderRadius: '8px'
            }
        },
        multiValue: (provided, state) => ({
            ...provided,
            paddingRight: '4px',
            backgroundColor:'#a688fa',
            color:'#282828'
            
            
        }),
        menu: (provided, state) => ({
            ...provided,
            backgroundColor:'#282828'
        }),

    }

    const cardSelectStyles = {
        option: (provided, state) => {
            return {
                ...provided,
                cursor: 'pointer',
                backgroundColor: state.isFocused ?'#a688fa' :  '#282828',
                color: state.isFocused ?'#121212' :  '#ffffffdd',
            }
        },
        control: (provided, state) => {
            return {
                ...provided,
                backgroundColor: '#282828',
                border: 'none',
                borderRadius: '8px'
            }
        },
        multiValue: (provided, state) => ({
            ...provided,
            paddingRight: '4px',
            backgroundColor:'#a688fa',
            color:'#282828'

        }),
        menu: (provided, state) => ({
            ...provided,
            backgroundColor:'#282828'
        }),
    }

    return (
        <div className={styles.page}>

            <Head>
                <title>ویرایش دک بازی</title>
            </Head>

            <Header user={globalUser} />

            <Nav user={globalUser} />
            {globalUser.isLoggedIn && (globalUser.access_level == 0 || globalUser.access_level == 1) ? <>
                {loading ? <><div><Circular /></div></> : <>
                    <div className="container">

                        <div className="page-title">
                            <h2>افزودن دک بازی</h2>
                            <Link href={'/mafia/conductor/deck'}>
                                <a>
                                    بازگشت
                                </a>
                            </Link>
                        </div>

                        <form onSubmit={insertDeck} className={"submit-form"}>

                            <div className="row">
                                <label htmlFor="title">نام دک</label>
                                <input type="text" id={"title"} value={deck.deck_name} readOnly={true} />
                            </div>

                            <div className="row">
                                <label htmlFor="roles">انتخاب نقش ها</label>
                                <Select closeMenuOnSelect={false} menuPlacement="auto" minMenuHeight={300} placeholder={'انتخاب کنید'} styles={roleSelectStyles} value={defaultRoles} defaultValue={defaultRoles} options={roleOptions} id={"roles"} isRtl={true} isMulti={true} onChange={changeRoles} />
                            </div>

                            <div className="row">
                                <label htmlFor="roles">انتخاب کارت های حرکت آخر</label>
                                <Select closeMenuOnSelect={false} menuPlacement="auto" minMenuHeight={300} placeholder={'انتخاب کنید'} styles={cardSelectStyles} value={defaultCards} defaultValue={defaultCards} options={cardOptions} id={"cards"} isRtl={true} isMulti={true} onChange={changeCards} />
                            </div>

                            <div className="row">
                                <button type={"submit"}>ویرایش دک</button>
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

// export async function getServerSideProps(context) {
//     // Check user
//     let user = (typeof context.req.cookies['token'] !== 'undefined') ? await checkToken(context.req.cookies['token']) : {}

//     // Get available sides
//     let sides = await fetch(`${process.env.GAME_URL}/game/side/get/availables`, {
//         method: 'GET',
//         headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
//     })
//     sides = await sides.json()

//     // Get available roles
//     let roles = await fetch(`${process.env.GAME_URL}/game/role/get/availables`, {
//         method: 'GET',
//         headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
//     })
//     roles = await roles.json()

//     // Get available last move cards
//     let cards = await fetch(`${process.env.GAME_URL}/game/last-move/get/availables`, {
//         method: 'GET',
//         headers: { "Authorization": `Bearer ${context.req.cookies['token']}` }
//     })
//     cards = await cards.json()

//     // Get available last move cards
//     let deck = await fetch(`${process.env.GAME_URL}/game/deck/get/single`, {
//         method: 'POST',
//         headers: { "Authorization": `Bearer ${context.req.cookies['token']}` },
//         body: JSON.stringify({ _id: context.query.id })
//     })
//     deck = await deck.json()

//     return {
//         props: {
//             user: user,
//             sides: sides.data.sides,
//             roles: roles.data.roles,
//             cards: cards.data,
//             deck: deck.data
//         }
//     }
// }

export default Edit