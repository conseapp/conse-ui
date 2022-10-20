import styles from '/styles/pages/learn.module.scss'
import Header from "../components/header";
import checkToken from "../utils/checkToken";
import Nav from "../components/nav";
import React from "react";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/free-mode';
import { CgChevronLeft } from "react-icons/cg";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CreateSideColor from "../utils/createSideColor";
import { useDispatch, useSelector } from 'react-redux';
import { getuser } from '../redux/actions';
import { wrapper } from '../redux/store';
import { useEffect } from 'react';
// import { wrapper } from '../../_app';

const Learn = props => {
    // const { sides, roles, cards } = props
    console.log(sides)
    console.log(roles)
    console.log(cards)

    useEffect(() => {
        getSides()
        getRoles()
        getCards()
    }, [])

    const { globalUser } = useSelector(state => state.userReducer)
    console.log(globalUser)

    // Get events
    const getSides = async () => {
        const res = await fetch(`${process.env.GAME_URL}/game/side/get/availables`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${globalUser.accessToken}`
            }
        })
        console.log(res)

        const data = await res.json()

        return data

    }
    // sides = await sides.json()

    // Get roles
    const getRoles = async () => {
        const res = await fetch(`${process.env.GAME_URL}/game/role/get/availables`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${globalUser.accessToken}`
            }
        })
        console.log(res)
        const data = await res.json()

        return data

    }
    // roles = await roles.json()

    // Get last move cards
    const getCards = async () => {
        const res = await fetch(`${process.env.GAME_URL}/game/last-move/get/availables`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${globalUser.accessToken}`
            }
        })
        console.log(res)

        const data = await res.json()

        return data

    }
    // cards = await cards.json()

    const _sides = getSides()
    const _roles = getRoles()
    const _cards = getCards()

    let sides = _sides.data.sides;
    let roles = _roles.data.roles;
    let cards = _cards.data;

    const openRoleModal = async e => {
        let id = e.target.getAttribute('data-id')

        roles.map(role => {
            if (role._id.$oid === id) {
                withReactContent(Swal).fire({
                    ...CreateSideColor(role.side_id.$oid),
                    title: <h3>{role.name}</h3>,
                    html: <div dangerouslySetInnerHTML={{ __html: role.desc }}></div>,
                    confirmButtonColor: 'var(--primary-color)',
                    confirmButtonText: 'متوجه شدم'
                })
            }
        })
    }

    const openCardModal = async e => {
        let id = e.target.getAttribute('data-id')

        cards.map(card => {
            if (card._id.$oid === id) {
                withReactContent(Swal).fire({
                    background: '#F6F6F6',
                    color: '#333',
                    title: <h3 style={{ color: 'var(--danger-color)' }}>{card.name}</h3>,
                    html: <div dangerouslySetInnerHTML={{ __html: card.desc }}></div>,
                    confirmButtonColor: 'var(--primary-color)',
                    confirmButtonText: 'متوجه شدم'
                })
            }
        })
    }

    return (
        <div className={styles.page}>

            <Header user={globalUser} profile={false} />

            <Nav user={globalUser} />

            <div className={"container"}>

                {
                    sides.map(side => {
                        return (
                            <div key={side._id.$oid} className="row" style={{ marginBottom: '40px' }}>
                                <div className="page-title">
                                    <h3>{side.name}</h3>
                                </div>

                                <Swiper spaceBetween={16} slidesPerView={2} freeMode={true} modules={[FreeMode]} className={styles.swiper}>
                                    {roles.map(role => {
                                        if (role.side_id.$oid === side._id.$oid) {
                                            return (
                                                <SwiperSlide key={role._id.$oid}>
                                                    <button type={"button"} style={CreateSideColor(role.side_id.$oid)} onClick={openRoleModal} data-id={role._id.$oid}>
                                                        <h3>{role.name}</h3>
                                                        <span dangerouslySetInnerHTML={{ __html: role.desc }} />
                                                        <b>
                                                            بیشتر
                                                            <CgChevronLeft />
                                                        </b>
                                                    </button>
                                                </SwiperSlide>
                                            )
                                        }
                                    })}
                                </Swiper>
                            </div>
                        )
                    })
                }

                <div className="row" style={{ marginBottom: '40px', display: 'none' }}>
                    <div className="page-title">
                        <h3>کارت های حرکت آخر</h3>
                    </div>

                    <Swiper spaceBetween={16} slidesPerView={2} freeMode={true} modules={[FreeMode]} className={styles.swiper}>
                        {cards.map(card => {
                            return (
                                <SwiperSlide key={card._id.$oid}>
                                    <button type={"button"} className={styles.lastMoveCard} onClick={openCardModal} data-id={card._id.$oid}>
                                        <h3>{card.name}</h3>
                                        <span dangerouslySetInnerHTML={{ __html: card.desc }} />
                                        <b>
                                            بیشتر
                                            <CgChevronLeft />
                                        </b>
                                    </button>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>

            </div>

        </div>
    )
}

// export async function loadSides() {
//     const { globalUser } = useSelector(state => state.userReducer)
//     const res = await fetch(`${process.env.GAME_URL}/game/side/get/availables`, {
//         method: 'GET',
//         headers: {
//             "Authorization": `Bearer ${globalUser.accessToken}`
//         }
//     })
//     const data = await res.json()

//     return data
// }

// export async function loadRoles() {
//     const { globalUser } = useSelector(state => state.userReducer)
//     const res = await fetch(`${process.env.GAME_URL}/game/role/get/availables`, {
//         method: 'GET',
//         headers: {
//             "Authorization": `Bearer ${globalUser.accessToken}`
//         }
//     })
//     const data = await res.json()

//     return data
// }
// export async function loadCards() {
//     const { globalUser } = useSelector(state => state.userReducer)
//     const res = await fetch(`${process.env.GAME_URL}/game/last-move/get/availables`, {
//         method: 'GET',
//         headers: {
//             "Authorization": `Bearer ${globalUser.accessToken}`
//         }
//     })
//     const data = await res.json()

//     return data
// }

// export async function getServerSideProps(context) {
// export const getServerSideProps = wrapper.getServerSideProps(

//     // const { globalUser } = useSelector(state => state.userReducer)

//     // Check user
//     // let user = ( typeof globalUser.accessToken !== 'undefined' ) ? await checkToken( globalUser.accessToken ) : {}


//     // const sides = await loadSides()
//     // const roles = await loadRoles()
//     // const cards = await loadCards()
//     (store) =>
//         async ({ params }) => {
//             await store.dispatch(getuser());
//             console.log("State on server", store.dispatch(getuser()));
//             const globalUser = store.dispatch(getuser())

//             // const dispatch = useDispatch();
//             // const fetchUser = () => dispatch(getuser());
//             // React.useEffect(() => {
//             //     fetchUser();
//             // }, []);
//             // const { globalUser } = useSelector(state => state.userReducer)
//             // console.log(globalUser)

//             // Get events
//             let sides = await fetch(`${process.env.GAME_URL}/game/side/get/availables`, {
//                 method: 'GET',
//                 headers: {
//                     "Authorization": `Bearer ${globalUser.accessToken}`
//                 }
//             })
//             sides = await sides.json()

//             // Get roles
//             let roles = await fetch(`${process.env.GAME_URL}/game/role/get/availables`, {
//                 method: 'GET',
//                 headers: {
//                     "Authorization": `Bearer ${globalUser.accessToken}`
//                 }
//             })
//             roles = await roles.json()

//             // Get last move cards
//             let cards = await fetch(`${process.env.GAME_URL}/game/last-move/get/availables`, {
//                 method: 'GET',
//                 headers: {
//                     "Authorization": `Bearer ${globalUser.accessToken}`
//                 }
//             })
//             cards = await cards.json()

//             return {
//                 props: {
//                     // user:  user,
//                     sides: sides.data.sides,
//                     roles: roles.data.roles,
//                     cards: cards.data
//                 }
//             }
//         }
// );


// export const getServerSideProps = wrapper.getServerSideProps(
//     (store) =>
//         async ({ params }) => {
//             // we can set the initial state from here
//             // we are setting to false but you can run your custom logic here
//             await store.dispatch(getuser());
//             console.log("State on server", store.getuser());
//             return {
//                 props: {
//                     user: false,
//                 },
//             };
//         }
// );


export default Learn