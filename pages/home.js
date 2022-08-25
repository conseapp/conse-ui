import React, { useEffect, useState } from "react"
import Nav from "../components/nav"
import Header from "../components/header"
import styles from '../assets/scss/Home.module.css'
import Link from "next/link"
import { MdLocationOn, MdOutlineKeyboardArrowLeft } from "react-icons/md"

// Swiper
import { Swiper, SwiperSlide } from "swiper/react"
import 'swiper/css'
import "swiper/css/free-mode"
import { FreeMode } from "swiper"

// React modal
import checkToken from "../utils/checkToken"
import { useRouter } from "next/router"

const Home = ( { events } ) => {
    const router = useRouter()

    useEffect( () => {
        Promise.resolve( checkToken() )
               .then( result => { if ( result !== true ) router.push( '/auth/login' ) } )
    }, [ router ] )

    const [ MyLastEvent, SetMyLastEvent ]           = useState( {} )
    const [ MyLastEventDates, SetMyLastEventDates ] = useState( [] )
    const [ WeekTopRole, SetWeekTopRole ]           = useState( {} )
    const [ LastEvents, SetLastEvents ]             = useState( [] )

    // Set last match result
    useEffect( () => {
        SetMyLastEvent( {
            'role':      'شهروند',
            'result':    'برد',
            'scenario':  'بازی حرفه ای',
            'conductor': 'علی هیس',
            'date':      '1401/2/10',
            'location':  'کافه ابی',
        } )
    }, [] )

    // Set last events date
    useEffect( () => {
        SetMyLastEventDates( [
            {
                id:   1,
                role: 'citizen',
                date: '1401/1/5',
            },
            {
                id:   2,
                role: 'mafia',
                date: '1401/1/12',
            },
            {
                id:   3,
                role: 'independent',
                date: '1401/3/5',
            },
            {
                id:   4,
                role: 'independent',
                date: '1401/2/8',
            },
        ] )
    }, [] )

    // Set the value of top role in this week
    useEffect( () => {
        SetWeekTopRole( {
            name:        'گردن کلفت',
            image:       '/week-top-role.png',
            description: 'در صورتی که گردن کلفت در فاز شب مورد اصابت شلیک واقع شود، در ابتدای روز بعد، نقش گردنکلفتاعلام میشود و گفته میشود که شب گذشته شات شده است. اما بلافاصله گردن کلفت از بازی خارج نخواهد شد و تا انتهای روز در بازی باقی خواهد می ماند. در انتهای روز گردن کلفت از بازی خارج میشود',
        } )
    }, [] )

    // Set last events
    useEffect( () => SetLastEvents( events ), [ events ] )

    return (
        <div className={ styles.page }>

            <Header />

            {/* <div className={ styles.myLastEvents }>
                <div className={ styles.title }>
                    <h2>آخرین ایونت من</h2>
                    <Link href={ '/lastEvents' }>
                        <a>
                            بیشتر
                            <MdOutlineKeyboardArrowLeft />
                        </a>
                    </Link>
                </div>
                <div className={ styles.content }>
                    <table>
                        <tbody>
                        <tr>
                            <td>نقش:</td>
                            <td>{ MyLastEvent.role }</td>
                            <td>نتیجه:</td>
                            <td>{ MyLastEvent.result }</td>
                        </tr>
                        <tr>
                            <td>سناریو:</td>
                            <td>{ MyLastEvent.scenario }</td>
                            <td>گرداننده:</td>
                            <td>{ MyLastEvent.conductor }</td>
                        </tr>
                        <tr>
                            <td>تاریخ:</td>
                            <td>{ MyLastEvent.date }</td>
                            <td>لوکیشن:</td>
                            <td>{ MyLastEvent.location }</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className={ styles.dates }>
                        <ul>
                            { MyLastEventDates.map( event => {
                                let color
                                color = ( event.role === 'citizen' ) ? '#00808E' : color
                                color = ( event.role === 'mafia' ) ? '#8E0000' : color
                                color = ( event.role === 'independent' ) ? '#8E5F00' : color
                                return <li key={ event.id } style={ { "--color": color } }>{ event.date }</li>
                            } ) }
                        </ul>
                    </div>
                </div>
            </div> */}

            {/* <div className="container">
                <div className={ styles.weekTopRole }>
                    <img src={ WeekTopRole.image } alt={ 'Week Top Role' } width={ 194 } height={ 230 } />
                    <div className={ styles.content }>
                        <h3>نقش برتر هفته</h3>
                        <h5>{ WeekTopRole.name }</h5>
                        <p>{ WeekTopRole.description }</p>
                        <div className={ styles.button }>
                            <Link href={ '/learn' }>
                                <a>
                                    آموزش نقش ها
                                    <MdOutlineKeyboardArrowLeft />
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className={ styles.lastEvents }>
                <div className="container">
                    <div className={ styles.title }>
                        <span>ایونت ها</span>
                            {/* <Link href={ '/event/explore' }>
                                <a>
                                    بیشتر
                                    <MdOutlineKeyboardArrowLeft />
                                </a>
                            </Link> */}
                    </div>
                    <div className={ styles.content }>
                        <Swiper spaceBetween={ 12 } slidesPerView={ 2 } freeMode={ true } modules={ [ FreeMode ] }>
                            { LastEvents.map( event => {
                                return ( <SwiperSlide key={ event._id.$oid }>
                                    <Link href={ `event/${ event._id.$oid }/` }>
                                        <a>
                                            <div className={ styles.sliderItem }>
                                                <div className={ styles.background } style={ { backgroundImage: `url(/events-slide-${ Math.floor( Math.random() * 4 + 1 ) }.png)` } }>
                                                    <div className={ styles.sliderItemContent }>
                                                        <MdLocationOn />
                                                        <div className={ styles.meta }>
                                                            <h3>{ event.title }</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                </SwiperSlide> )
                            } ) }
                        </Swiper>
                    </div>
                </div>
            </div>

            <div className={ styles.news }>
                <div className="container">
                    <Swiper spaceBetween={ 12 } slidesPerView={ 1 } freeMode={ true } modules={ [ FreeMode ] }>
                        <SwiperSlide>
                            {/* <div className={ styles.sliderItem }>
                                <div className={ styles.background }
                                     style={ { backgroundImage: 'url(/news-slide-1.png)' } }>
                                    <div className={ styles.sliderItemContent }>
                                        <h3>مسابقه بزرگ مافیا در تهران</h3>
                                        <Link href={ '/event' }>
                                            <a>
                                                اطلاعات بیشتر / ثبت نام
                                                <MdOutlineKeyboardArrowLeft />
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            </div> */}
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className={ styles.sliderItem }>
                                <div className={ styles.background }
                                     style={ { backgroundImage: 'url(/news-slide-2.png)' } }>
                                    <div className={ styles.sliderItemContent }>
                                        <h3>مسابقه بزرگ مافیا در تهران</h3>
                                        <Link href={ '/event' }>
                                            <a>
                                                اطلاعات بیشتر / ثبت نام
                                                <MdOutlineKeyboardArrowLeft />
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>

            <Nav />

        </div>
    )
}


export async function getStaticProps() {
    const availableEvents = await fetch( `${ process.env.EVENT_URL }/event/get/all/in-going` )
    const { data }        = await availableEvents.json()

    return {
        revalidate: 10,
        props:      {
            events: data.events,
        },
    }
}

export default Home