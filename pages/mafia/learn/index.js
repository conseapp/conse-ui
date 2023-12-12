import styles from '/styles/pages/learn/index.module.scss'
import Header from "../../../components/header";
import checkToken from "../../../utils/checkToken";
import Nav from "../../../components/nav";
import React from "react";
import { Pagination, FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { CgChevronLeft } from "react-icons/cg";
import { CgMoreO } from "react-icons/cg";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CreateSideColor from "../../../utils/createSideColor";
import { useDispatch, useSelector } from 'react-redux';
import { getuser } from '../../../redux/actions';
import { wrapper } from '../../../redux/store';
import { useEffect } from 'react';
import { useState } from 'react';
import Circular from '../../../components/Circular';
import { MdChevronLeft } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { wrapper } from '../../_app';
import Image from 'next/image';

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
    const [query, setQuery] = useState('')
    const Router = useRouter()


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
        if (globalUser && globalUser.isLoggedIn) {
            loadSides()
            loadRoles()
            loadCards()
        }
        else {
            Router.push('/login')
        }
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
                    background: '#080C1D',
                    color: '#fff',
                    title: <h3 dangerouslySetInnerHTML={{ __html: card.name }} style={{ color: 'var(--danger-color)' }}></h3>,
                    html: <div dangerouslySetInnerHTML={{ __html: card.desc }}></div>,
                    confirmButtonColor: 'var(--primary-color)',
                    confirmButtonText: 'متوجه شدم'
                })
            }
        })
    }

    const Search = (data) => {
        return data.filter(item => item.name.toLowerCase().includes(query));
    }

    return (
        <div className={styles.page}>

            <Header user={globalUser} profile={false} />

            <Nav user={globalUser} />

            <div className={styles.search}>
                <label>
                    <input type={"text"} onChange={e => setQuery(e.target.value)} placeholder={"جست و جو کنید"} />
                    <MdSearch />
                </label>
            </div>

            <>
                {loading ? <><div><Circular /></div></> : <>
                    <div className={styles.container}>

                        {
                            sides.map(side => {
                                return (
                                    roles.filter(role => (role.side_id.$oid === side._id.$oid &&
                                        role.name.toLowerCase().includes(query))).length
                                        ?
                                        <div key={side._id.$oid} className={styles.cardrow} >
                                            <div className="page-title">
                                                <h3>{side.name}</h3>
                                                <Link href={`/mafia/learn/${side._id.$oid}`}>
                                                    <a>
                                                        بیشتر
                                                        <MdChevronLeft />
                                                    </a>
                                                </Link>
                                            </div>

                                            <Swiper
                                                grabCursor={true}
                                                slidesPerView={'auto'}
                                                pagination={{
                                                    dynamicBullets: true,
                                                }}
                                                freeMode={true}
                                                modules={[FreeMode, Pagination]}
                                                className={styles.swiper}
                                                spaceBetween={30}
                                            >
                                                {Search(roles).map(role => {
                                                    if (role.side_id.$oid === side._id.$oid) {
                                                        return (
                                                            <SwiperSlide className={styles.swiper_slide} key={role._id.$oid}>
                                                                <div className={styles.card} onClick={openRoleModal} data-id={role._id.$oid}>
                                                                    <h3>{role.name}</h3>
                                                                    <Image
                                                                        src={`/roles/${role._id.$oid}.jpg`} // Route of the image file
                                                                        layout='fill'
                                                                        alt={role.name}
                                                                    />
                                                                    <b data-id={role._id.$oid}>
                                                                        {/* بیشتر */}
                                                                        <CgMoreO />
                                                                    </b>
                                                                </div>
                                                            </SwiperSlide>
                                                        )
                                                    }
                                                })}
                                            </Swiper>
                                        </div> : <></>
                                )
                            })
                        }

                        {Search(cards).length ?
                            <div className={styles.cardrow}>
                                <div className="page-title">
                                    <h3>کارت های حرکت آخر</h3>
                                    <Link href={"/mafia/learn/last-move-cards"}>
                                        <a>
                                            بیشتر
                                            <MdChevronLeft />
                                        </a>
                                    </Link>
                                </div>

                                <Swiper
                                    grabCursor={true}
                                    slidesPerView={'auto'}
                                    pagination={{
                                        dynamicBullets: true,
                                    }}
                                    freeMode={true}
                                    modules={[FreeMode, Pagination]}
                                    className={styles.swiper}
                                    spaceBetween={30}
                                >
                                    {Search(cards).map(card => {
                                        return (
                                            <SwiperSlide className={`${styles.swiper_slide} ${styles.last_move_slide}`} key={card._id.$oid}>
                                                <div className={`${styles.card} ${styles.lastMoveCard}`} onClick={openCardModal} data-id={card._id.$oid}>
                                                    <h3 dangerouslySetInnerHTML={{ __html: card.name }}></h3>
                                                    <Image
                                                        src={`/last-move-cards/${card._id.$oid}.jpg`} // Route of the image file
                                                        layout='fill'
                                                        alt={card.name}
                                                    />
                                                    <b data-id={card._id.$oid}>
                                                        {/* بیشتر */}
                                                        <CgMoreO />
                                                    </b>
                                                </div>
                                            </SwiperSlide>
                                        )
                                    })}
                                </Swiper>
                            </div> : <></>
                        }

                        {
                            (!Search(roles).length && !Search(cards).length)
                            &&
                            <div className={styles.notFound}>
                                <span className={styles.icon}>
                                    :
                                </span>
                                <h2>متاسفانه نتیجه ای یافت نشد !!</h2>
                                <h4>لطفا دوباره تلاش کنید</h4>
                            </div>



                        }

                    </div>
                </>}
            </>

        </div >
    )
}





export default Learn