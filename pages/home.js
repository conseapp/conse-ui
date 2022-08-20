import React, { useEffect, useState, CSSProperties } from "react";
import Nav from "../components/nav";
import Header from "../components/header";
import styles from '../assets/scss/Home.module.css'
import modal from '../assets/scss/Modal.module.css'
import Link from "next/link";
import {
    MdGames,
    MdLocationOn,
    MdOutlineKeyboardArrowLeft,
    MdLocationPin,
    MdOutlineWarningAmber,
    MdCheckCircleOutline,
} from "react-icons/md";
import { RiUser3Fill } from "react-icons/ri";
import { IoTicket } from "react-icons/io5"

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import "swiper/css/free-mode";
import { FreeMode } from "swiper";

// React modal
import Modal from 'react-modal';
import checkToken from "../utils/checkToken";
import { useRouter } from "next/router";

const Home = ( { events } ) => {
    const router = useRouter();

    useEffect( () => {
        Promise.resolve( checkToken() )
               .then( result => {
                   if ( result !== true ) router.push( '/auth/login' )
               } )
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
    useEffect( () => {
        SetLastEvents( events )
    }, [events] )

    // Event Modal
    const [ EventModalIsOpen, SetEventModalIsOpen ] = useState( false );
    const OpenEventModal                            = () => SetEventModalIsOpen( true );
    const CloseEventModal                           = () => SetEventModalIsOpen( false );
    const AfterOpenEventModal                       = () => {
        console.log( 'Modal Opened!' )
    }

    // Confirm Event
    const [ ConfirmEventModalIsOpen, SetConfirmEventModalIsOpen ] = useState( false );
    const OpenConfirmEventModal                                   = () => {
        CloseEventModal()
        SetConfirmEventModalIsOpen( true )
    };
    const CloseConfirmEventModal                                  = () => SetConfirmEventModalIsOpen( false );
    const AfterOpenConfirmEventModal                              = () => {
        console.log( 'Modal Opened!' )
    }

    // Submitted Event
    const [ SubmittedEventModalIsOpen, SetSubmittedEventModalIsOpen ] = useState( false );
    const OpenSubmittedEventModal                                     = () => {
        CloseConfirmEventModal()
        SetSubmittedEventModalIsOpen( true )
    };
    const CloseSubmittedEventModal                                    = () => SetSubmittedEventModalIsOpen( false );
    const AfterOpenSubmittedEventModal                                = () => {
        console.log( 'Modal Opened!' )
    }

    return (
        <div className={ styles.page }>
            <Header />

            <div className={ styles.myLastEvents }>
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
            </div>

            <div className="container">
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
            </div>

            <div className={ styles.lastEvents }>
                <div className="container">
                    <div className={ styles.title }>
                        <span>ایونت ها</span>
                        <Link href={ '/event/explore' }>
                            <a>
                                بیشتر
                                <MdOutlineKeyboardArrowLeft />
                            </a>
                        </Link>
                    </div>
                    <div className={ styles.content }>
                        <Swiper spaceBetween={ 12 } slidesPerView={ 2 } freeMode={ true } modules={ [ FreeMode ] }>
                            { LastEvents.map( event => {
                                return ( <SwiperSlide key={ event._id.$oid }>
                                    <button type={ "button" } onClick={ OpenEventModal } data-id={ event._id.$oid }>
                                        <div className={ styles.sliderItem }>
                                            <div className={ styles.background } style={ { backgroundImage: `url(/events-slide-1.png)` } }>
                                                <div className={ styles.sliderItemContent }>
                                                    <MdLocationOn />
                                                    <div className={ styles.meta }>
                                                        <h3>کافه لند</h3>
                                                        {/*<ul>*/ }
                                                        {/*    <li>{ event.start }</li>*/ }
                                                        {/*    <li>سناریو: { event.scenario }</li>*/ }
                                                        {/*    <li>ظرفیت: { event.capacity }</li>*/ }
                                                        {/*    <li>گرداننده: { event.god }</li>*/ }
                                                        {/*</ul>*/ }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
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
                            <div className={ styles.sliderItem }>
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
                            </div>
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

            {/* Modals */ }
            <Modal isOpen={ EventModalIsOpen } onAfterOpen={ AfterOpenEventModal } onRequestClose={ CloseEventModal } overlayClassName={ modal.Overlay } className={ modal.eventModal }>
                <div className={ modal.header }>
                    <img src={ '/modal-header.png' } alt={ 'Modal Header' } />
                </div>
                <div className={ modal.body }>
                    <div className={ modal.title }>
                        <h3>ایونت گروه هوادار</h3>
                        <div className={ modal.meta }>
                            <span>18/2/1400 - ساعت 18</span>
                            <span>ظرفیت 50/10</span>
                        </div>
                    </div>
                    <div className={ modal.content }>
                        {/*<div className={ modal.meta }>*/ }
                        {/*    <ul>*/ }
                        {/*        <li>*/ }
                        {/*            <MdGames />*/ }
                        {/*            سناریو: بازی حرفه ای*/ }
                        {/*        </li>*/ }
                        {/*        <li>*/ }
                        {/*            <RiUser3Fill />*/ }
                        {/*            گرداننده: علی عباسی*/ }
                        {/*        </li>*/ }
                        {/*        <li>*/ }
                        {/*            <IoTicket />*/ }
                        {/*            ورودی: 15000 تومان*/ }
                        {/*        </li>*/ }
                        {/*        <li>*/ }
                        {/*            <MdLocationPin style={ { color: "#B80000" } } />*/ }
                        {/*            لوکیشن: کافه لند*/ }
                        {/*        </li>*/ }
                        {/*    </ul>*/ }
                        {/*</div>*/ }
                        <div className={ modal.description }>
                            <strong>توضیحات:</strong>
                            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از
                            صنعت چاپ، و با استفاده از طراحان گرافیک است،
                            چاپگرها و متون بلکه روزنامه و مجله در ستون و
                            سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی
                            مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای
                            کاربردی می باشد، کتابهای زیادی در شصت و سه درصد
                            گذشته حال و آینده، شناخت فراوان جامعه و متخصصان
                            را می طلبد، تا با نرم افزارها شناخت بیشتری را برای
                            طراحان رایانه ای علی الخصوص طراحان خلاقی، و
                            فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت
                            می توان امید داشت که تمام و دشواری موجود در ارائه
                        </div>
                    </div>
                </div>
                <div className={ modal.footer }>
                    <button type={ "button" } onClick={ OpenConfirmEventModal }>ثبت نام</button>
                    <button type={ "button" } onClick={ CloseEventModal } className={ modal.decline }>لغو</button>
                </div>
            </Modal>

            <Modal isOpen={ ConfirmEventModalIsOpen } onAfterOpen={ AfterOpenConfirmEventModal } onRequestClose={ CloseConfirmEventModal } overlayClassName={ modal.Overlay } className={ modal.confirmEventModal }>
                <div className={ modal.header }>
                    <div className={ modal.title }>
                        <h3>ایونت گروه هوادار</h3>
                        <div className={ modal.meta }>
                            <span>18/2/1400 - ساعت 18</span>
                            <span>ظرفیت 50/10</span>
                        </div>
                    </div>
                </div>
                <div className={ modal.body }>
                    <div className={ modal.message }>
                        آیا از ثبت نام خود مطمئن هستید؟
                    </div>
                    <div className={ modal.warning }>
                        <MdOutlineWarningAmber />
                        درصورت کنسلی 10 امتیاز از شما کسر خواهد شد
                    </div>
                </div>
                <div className={ modal.footer }>
                    <button type={ "button" } onClick={ OpenSubmittedEventModal }>بله</button>
                    <button type={ "button" } onClick={ CloseConfirmEventModal } className={ modal.decline }>خیر</button>
                </div>
            </Modal>

            <Modal isOpen={ SubmittedEventModalIsOpen } onAfterOpen={ AfterOpenSubmittedEventModal } onRequestClose={ CloseSubmittedEventModal } overlayClassName={ modal.Overlay } className={ modal.submittedEventModal }>
                <div className={ modal.header }>
                    <img src={ '/modal-header.png' } alt={ 'Modal Header' } />
                </div>
                <div className={ modal.body }>
                    <p>
                        <MdCheckCircleOutline />
                        ایونت با موفقیت به پروفایل شما اضافه شد
                    </p>
                </div>
                <div className={ modal.footer }>
                    <h3>منتظرتون هستیم</h3>
                    <span className={ modal.address }> کافه لند، تهران، ولیعصر، بزرگمهر پاساژ بزرگمهر</span>
                    <time>18/2/1400 - ساعت 18</time>
                </div>
            </Modal>

            <Nav />
        </div>
    )
}


export async function getStaticProps() {
    const availableEvents = await fetch( `${ process.env.EVENT_URL }/event/get/availables` )
    const { data }        = await availableEvents.json()

    return {
        revalidate: 10,
        props:      {
            events: data.events,
        },
    }
}

export default Home