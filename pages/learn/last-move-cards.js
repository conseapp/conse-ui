import React, { useEffect, useState } from 'react'
import styles from '/styles/pages/learn/single-side.module.scss'
import Header from "../../components/header";
import Nav from "../../components/nav";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';
import { CgMoreO } from "react-icons/cg";
import Circular from '../../components/Circular';
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { MdSearch } from "react-icons/md";
import Image from 'next/image';
import Link from 'next/link';



export default function LastMoveCard() {

    const { globalUser } = useSelector(state => state.userReducer)
    const [cards, setCards] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')


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
        loadCards()
    }, [])

    useEffect(() => {
        if (cards)
            setLoading(false)
    }, [cards])

    const { query } = useRouter()

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
        return data.filter(item => item.name.toLowerCase().includes(searchQuery));
    }

    return (
        <div className={styles.page}>


            <Header user={globalUser} profile={false} />

            <Nav user={globalUser} />

            <div className={styles.search}>
                <label>
                    <input type={"text"} onChange={e => setSearchQuery(e.target.value)} placeholder={"جست و جو کنید"} />
                    <MdSearch />
                </label>
            </div>

            <>
                {loading ? <><div><Circular /></div></> : <>
                    <div className={styles.container}>
                        <div className="page-title">
                            <h3>کارت های حرکت آخر</h3>
                            <Link href={'/learn'}>
                                <a>
                                    بازگشت
                                </a>
                            </Link>
                        </div>
                        {
                            cards.filter(card => card.name.toLowerCase().includes(searchQuery)).length ?
                                <ul className={`${styles.list} ${styles.last_move_list}`}>
                                    {Search(cards).map(card => {
                                        return (
                                            <li key={card._id.$oid}>
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
                                            </li>
                                        )
                                    })}
                                </ul >


                                :
                                <div className={styles.notFound}>
                                    <span className={styles.icon}>
                                        :
                                    </span>
                                    <h2>متاسفانه نتیجه ای یافت نشد !!</h2>
                                    <h4>لطفا دوباره تلاش کنید</h4>
                                </div>
                        }
                    </div>
                </>
                }

            </>

        </div >
    )
}
