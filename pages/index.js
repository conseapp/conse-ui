import styles from '/styles/pages/index.module.scss'
import Head from "next/head";
import Header from "/components/header";
import checkToken from "../utils/checkToken";
import Nav from "../components/nav";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { MdChevronLeft } from "react-icons/md";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { getuser } from '../redux/actions';

const Index = props => {
    const router = useRouter()
    // const dispatch = useDispatch();
    // const fetchUser = () => dispatch(getuser());
    // useEffect(() => {
    //     fetchUser();
    // }, []);

    const { user } = useSelector(state => state.userReducer)
    console.log(user)


    /**
     * Get all props of this page.
     * @version 1.0
     */
    const { events } = props

    return (
        <div className={styles.page}>

            <Head>
                <title>کنسه</title>
            </Head>

            <Header user={user} />

            <div className="container">
                <div className={styles.lastEvents}>
                    <div className={"page-title"}>
                        <h3>آخرین ایونت ها</h3>
                        <Link href={"/events"}>
                            <a>
                                بیشتر
                                <MdChevronLeft />
                            </a>
                        </Link>
                    </div>
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        autoplay={{
                            delay: 1500,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            dynamicBullets: true,
                        }}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 20,
                            depth: 200,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        modules={[Autoplay, EffectCoverflow, Pagination]}
                        className={styles.swiper}
                    >
                        {events.slice(Math.max(events.length - 5, 0)).reverse().map(event => {
                            return (
                                <SwiperSlide className={styles.swiper_slide} key={event._id.$oid}>
                                    <Link href={`/events/${event._id.$oid}`}>
                                        <a className={styles.item} style={{ backgroundImage: 'url("/events-slide-1.png")' }}>
                                            <h3>{event.title}</h3>
                                        </a>
                                    </Link>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            </div>

            <Nav user={user} />

        </div>
    )
}

export async function getServerSideProps() {
    // Check user
    // let user = (typeof context.req.cookies['token'] !== 'undefined') ? await checkToken(context.req.cookies['token']) : {}

    // Get events
    let events = await fetch(`${process.env.EVENT_URL}/event/get/all/in-going`)
    events = await events.json()

    return {
        props: {
            // user: user,
            events: events.data
        }
    }
}

export default Index