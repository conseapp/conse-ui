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

const Create = props => {
    const { globalUser } = useSelector(state => state.userReducer)
    const [sides, setSides] = useState(undefined)
    const [roles, setRoles] = useState(undefined)
    const [cards, setCards] = useState(undefined)
    const [loading, setLoading] = useState(true)

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
        if (data.status == 200)
            setRoles(data.data.roles)
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
        // return data
    }
    useEffect(() => {
        loadSides()
        loadRoles()
        loadCards()
    }, [])
    useEffect(() => {
        if (sides && roles && cards)
            setLoading(false)
    }, [sides, roles, cards])

    /**
     * User next.js router.
     * @version 1.0
     */
    const router = useRouter()

    /**
     * Get all props of this page.
     * @version 1.0
     */


    // const { user, sides, roles, cards } = props

    /**
     * Create drop down menu options.
     * @version 1.0
     */
    const [roleOptions, setRoleOptions] = useState([])

    /**
     * Selected roles.
     * @version 1.0
     */
    const [selectedRoles, setSelectedRoles] = useState([])

    /**
     * Change the style of the dropdown list.
     * @version 1.0
     * @type {{control: (function(*, *): *&{border: string, backgroundColor: string, borderRadius: string}), multiValue: (function(*, *): *&{border: string, paddingRight: string}), option: (function(*, *): *&{cursor: string, "&:hover": {}})}}
     */
    const roleSelectStyles = {
        option: (provided, state) => {
            let { side_id } = JSON.parse(state.value)
            return {
                ...provided,
                backgroundColor: state.isFocused ? CreateSideColor(side_id.$oid).background : '#282828',
                color: state.isFocused ? CreateSideColor(side_id.$oid).color : CreateSideColor(side_id.$oid).background,
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
            backgroundColor: '#a688fa',
            color: '#282828'


        }),
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: '#282828'
        }),

    }

    /**
     * Set options of select box.
     * @version 1.0
     */
    useEffect(() => {
        if (sides && roles) {
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
    }, [sides, roles])

    /**
     * Registering the selected roles in the corresponding variable.
     * @version 1.0
     * @param options
     * @constructor
     */
    const handleSelectedRoles = id => options => {
        setSelectedRoles(prev => ({ ...prev, [id]: options }))
    }

    /**
     * Create drop down menu options.
     * @version 1.0
     */
    const [cardOptions, setCardOptions] = useState([])

    /**
     * Selected roles.
     * @version 1.0
     */
    const [selectedCards, setSelectedCards] = useState([])

    /**
     * Change the style of the dropdown list.
     * @version 1.0
     * @type {{control: (function(*, *): *&{border: string, backgroundColor: string, borderRadius: string}), multiValue: (function(*, *): *&{border: string, paddingRight: string}), option: (function(*, *): *&{cursor: string, "&:hover": {}})}}
     */
    const cardSelectStyles = {
        option: (provided, state) => {
            return {
                ...provided,
                cursor: 'pointer',
                backgroundColor: state.isFocused ? '#a688fa' : '#282828',
                color: state.isFocused ? '#121212' : '#ffffffdd',
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
            backgroundColor: '#a688fa',
            color: '#282828'

        }),
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: '#282828'
        }),
    }

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
     * Enable the registration button if the name field is not empty.
     * @version 1.0
     * @param e
     * @constructor
     */
    const CheckDeckName = (e) => {
        let value = e.target.value,
            submitButton = document.querySelector('button[type="submit"]')

        if (value !== '') {
            submitButton.removeAttribute('disabled')
        } else {
            submitButton.setAttribute('disabled', 'disabled')
        }
    }

    /**
     * Registering the selected roles in the corresponding variable.
     * @version 1.0
     * @param options
     * @constructor
     */
    const selectCards = options => setSelectedCards(options)

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
        // let token = getCookie('token')
        let token = globalUser.accessToken

        // Disable submit button
        button.setAttribute('disabled', 'disabled')

        Object.keys(selectedRoles).forEach(side => {
            selectedRoles[side].forEach(role => {
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
            })
        })


        selectedCards.forEach(card => {
            let {
                _id,
                name,
                rate,
                desc,
                is_disabled,
                created_at,
                updated_at
            } = JSON.parse(card.value)

            cards.push({
                "_id": _id.$oid,
                "name": name,
                "rate": rate,
                "desc": desc,
                "is_disabled": is_disabled,
                "created_at": created_at,
                "updated_at": updated_at
            })
        })

        let { status } = await CreateDeck(title.value, roles, cards, token)

        if (status) {
            button.removeAttribute('disabled')

            if (status === 201 || status === 302) {
                toast.success('دک با موفقیت ایجاد شد')

                setTimeout(() => router.push('/mafia/conductor/deck/'), 2000)
            } else if (status == 403) {
                toast.error('ACCESS DENIED')
                button.removeAttribute('disabled')
            }
            else {
                toast.error('خطایی در هنگام ایجاد دک بوجود آمده')
                button.removeAttribute('disabled')
            }
        }
    }

    const getTotalRoles = () => {
        let totalRoles = 0;

        for (let key in selectedRoles) {
            totalRoles += selectedRoles[key].length;
        }

        return totalRoles;
    }

    return (
        <div className={styles.page}>

            <Head>
                <title>افزودن دک بازی</title>
            </Head>

            <Header user={globalUser} />

            <Nav user={globalUser} />
            {globalUser && globalUser.isLoggedIn ?
                <>
                    {globalUser.access_level == 2 ?
                        <>
                            <div className="container">
                                <div>شما مجاز به ساخت دک نمیابشید</div>
                            </div>
                        </> :
                        <>
                            {loading ? <div><Circular /></div> : <>
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
                                            <input type="text" id={"title"} onChange={CheckDeckName} />
                                        </div>

                                        <div className={`row ${styles.cards}`}>
                                            <label htmlFor="cards">انتخاب کارت های حرکت آخر</label>
                                            <Select closeMenuOnSelect={false} placeholder={'انتخاب کنید'} styles={cardSelectStyles} options={cardOptions} id={"cards"} isRtl={true} isMulti={true} onChange={selectCards} />
                                        </div>

                                        <fieldset className={styles.roles}>
                                            <legend> انتخاب نقش ها
                                                {
                                                    (getTotalRoles() !== 0) &&
                                                    <span className={styles.totalRoles}>
                                                        {getTotalRoles()}
                                                    </span>
                                                }
                                            </legend>
                                            <div className={styles.selectors_container}>
                                                {
                                                    sides.map((side) => {
                                                        const sideOption = roleOptions.filter(option => option.label === side.name)[0].options
                                                        return (
                                                            sideOption.length ?
                                                                <div className={`row ${styles.row}`} key={`${side._id.$oid}`}>
                                                                    <label htmlFor="roles">انتخاب نقش های <span>{side.name}</span></label>
                                                                    <Select closeMenuOnSelect={false} placeholder={'انتخاب کنید'} styles={roleSelectStyles} value={selectedRoles[side._id.$oid]} options={sideOption} id={"roles"} isRtl={true} isMulti={true} onChange={handleSelectedRoles(side._id.$oid)} />
                                                                </div>
                                                                : <></>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </fieldset>

                                        <div className="row">
                                            <button type={"submit"} disabled={true}>ثبت دک</button>
                                        </div>
                                    </form>

                                </div>
                            </>}
                        </>}
                </> : <>
                    <div className="container">وارد حسابکاربری خود شوید</div>
                </>}
            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

// export async function getServerSideProps( context ) {
//     // Check user
//     let user = ( typeof context.req.cookies['token'] !== 'undefined' ) ? await checkToken( context.req.cookies['token'] ) : {}

//     // Get available sides
//     let sides = await fetch( `${ process.env.GAME_URL }/game/side/get/availables`, {
//         method:  'GET',
//         headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
//     } )
//     sides     = await sides.json()

//     // Get available roles
//     let roles = await fetch( `${ process.env.GAME_URL }/game/role/get/availables`, {
//         method:  'GET',
//         headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
//     } )
//     roles     = await roles.json()

//     // Get available last move cards
//     let cards = await fetch( `${ process.env.GAME_URL }/game/last-move/get/availables`, {
//         method:  'GET',
//         headers: { "Authorization": `Bearer ${ context.req.cookies['token'] }` }
//     } )
//     cards     = await cards.json()

//     return {
//         props: {
//             user:  user,
//             sides: sides.data.sides,
//             roles: roles.data.roles,
//             cards: cards.data
//         }
//     }
// }

export default Create