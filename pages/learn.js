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
import { useState } from 'react';
import Circular from '../components/Circular';
// import { wrapper } from '../../_app';

const Learn = props => {
    // const { sides, roles, cards } = props
    console.log(sides)
    console.log(roles)
    console.log(cards)
    const { globalUser } = useSelector(state => state.userReducer)
    console.log(globalUser)
    let user = (globalUser && globalUser.accessToken) ? checkToken(globalUser.accessToken) : {}
    console.log(user)
    const [sides, setSides] = useState(undefined)
    const [roles, setRoles] = useState(undefined)
    const [cards, setCards] = useState(undefined)
    const [loading, setLoading] = useState(true)

    const loadSides = async () => {
        // const { globalUser } = useSelector(state => state.userReducer)
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
        // const { globalUser } = useSelector(state => state.userReducer)
        const res = await fetch(`${process.env.GAME_URL}/game/role/get/availables`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${globalUser.accessToken}`
            }
        })
        const data = await res.json()
        if (data.status == 200)
            setRoles(data.data.roles)
        console.log(data)
        // return data
    }
    const loadCards = async () => {
        // const { globalUser } = useSelector(state => state.userReducer)
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

    useEffect(() => {
        loadSides()
        loadRoles()
        loadCards()
    }, [])
    useEffect(() => {
        if (sides && roles && cards)
            setLoading(false)
    }, [sides, roles, cards])



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

            <>
                {loading ? <><div><Circular /></div></> : <>
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
                </>}
            </>

        </div>
    )
}





export default Learn