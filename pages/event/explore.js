import React, {useState} from "react";
import styles from "../../assets/scss/Explore.module.css";
import Header from "../../components/header";
import Nav from "../../components/nav";
import {IoIosSearch} from "react-icons/io";
import Masonry from "react-masonry-css";
import {MdCheckCircleOutline, MdGames, MdLocationOn, MdLocationPin, MdOutlineWarningAmber} from "react-icons/md";
import Modal from "react-modal";
import modal from "../../assets/scss/Modal.module.css";
import {RiUser3Fill} from "react-icons/ri";
import {IoTicket} from "react-icons/io5";


const Explore = () => {
    let items = [
        {
            id: 1,
            name: 'کافه بازینو',
            background: '/events-slide-1.png',
            date: '22 فروردین',
            scenario: 'بازی حرفه ای',
            capacity: '10/50',
            conductor: 'علی عباسی'
        },
        {
            id: 2,
            name: 'کافه بازینو',
            background: '/events-slide-2.png',
            date: '22 فروردین',
            scenario: 'بازی حرفه ای',
            capacity: '10/50',
            conductor: 'علی عباسی'
        },
        {
            id: 3,
            name: 'کافه بازینو',
            background: '/events-slide-3.png',
            date: '22 فروردین',
            scenario: 'بازی حرفه ای',
            capacity: '10/50',
            conductor: 'علی عباسی'
        },
        {
            id: 4,
            name: 'کافه بازینو',
            background: '/events-slide-4.png',
            date: '22 فروردین',
            scenario: 'بازی حرفه ای',
            capacity: '10/50',
            conductor: 'علی عباسی'
        },
    ]

    // Event Modal
    const [eventModalIsOpen, setEventModalIsOpen] = useState(false);
    const openEventModal = () => setEventModalIsOpen(true);
    const closeEventModal = () => setEventModalIsOpen(false);
    const afterOpenEventModal = () => {
        console.log('Modal Opened!')
    }

    // Confirm Event
    const [confirmEventModalIsOpen, setConfirmEventModalIsOpen] = useState(false);
    const openConfirmEventModal = () => {
        closeEventModal()
        setConfirmEventModalIsOpen(true)
    };
    const closeConfirmEventModal = () => setConfirmEventModalIsOpen(false);
    const afterOpenConfirmEventModal = () => {
        console.log('Modal Opened!')
    }

    // Submitted Event
    const [submittedEventModalIsOpen, setSubmittedEventModalIsOpen] = useState(false);
    const openSubmittedEventModal = () => {
        closeConfirmEventModal()
        setSubmittedEventModalIsOpen(true)
    };
    const closeSubmittedEventModal = () => setSubmittedEventModalIsOpen(false);
    const afterOpenSubmittedEventModal = () => {
        console.log('Modal Opened!')
    }

    return (
        <div className={styles.page}>
            <Header showProfile={false} />

            <div className={styles.search}>
                <label>
                    <IoIosSearch />
                    <input type="text" placeholder="جست و جو کنید" />
                </label>
            </div>

            <div className="container">
                <Masonry breakpointCols={2} className={styles.masonryGrid} columnClassName={styles.masonryGridColumn}>
                    {items.map(item => {
                        return (
                            <button type={"button"} onClick={openEventModal} key={item.id}>
                                <div className={styles.sliderItem}>
                                    <div className={styles.background} style={{backgroundImage: `url(${item.background})`}}>
                                        <div className={styles.sliderItemContent}>
                                            <MdLocationOn />
                                            <div className={styles.meta}>
                                                <h3>{item.name}</h3>
                                                <ul>
                                                    <li>{item.date}</li>
                                                    <li>سناریو : {item.scenario}</li>
                                                    <li>ظریفیت {item.capacity}</li>
                                                    <li>گرداننده : {item.conductor}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </Masonry>
            </div>

            {/* Modals */}
            <Modal isOpen={eventModalIsOpen} onAfterOpen={afterOpenEventModal} onRequestClose={closeEventModal} overlayClassName={modal.Overlay} className={modal.eventModal}>
                <div className={modal.header}>
                    <img src={'/modal-header.png'} alt={'Modal Header'} />
                </div>
                <div className={modal.body}>
                    <div className={modal.title}>
                        <h3>ایونت گروه هوادار</h3>
                        <div className={modal.meta}>
                            <span>18/2/1400 - ساعت 18</span>
                            <span>ظرفیت 50/10</span>
                        </div>
                    </div>
                    <div className={modal.content}>
                        <div className={modal.meta}>
                            <ul>
                                <li>
                                    <MdGames />
                                    سناریو: بازی حرفه ای
                                </li>
                                <li>
                                    <RiUser3Fill />
                                    گرداننده: علی عباسی
                                </li>
                                <li>
                                    <IoTicket />
                                    ورودی: 15000 تومان
                                </li>
                                <li>
                                    <MdLocationPin style={{color: "#B80000"}} />
                                    لوکیشن: کافه لند
                                </li>
                            </ul>
                        </div>
                        <div className={modal.description}>
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
                <div className={modal.footer}>
                    <button type={"button"} onClick={openConfirmEventModal}>ثبت نام</button>
                    <button type={"button"} onClick={closeEventModal} className={modal.decline}>لغو</button>
                </div>
            </Modal>

            <Modal isOpen={confirmEventModalIsOpen} onAfterOpen={afterOpenConfirmEventModal} onRequestClose={closeConfirmEventModal} overlayClassName={modal.Overlay} className={modal.confirmEventModal}>
                <div className={modal.header}>
                    <div className={modal.title}>
                        <h3>ایونت گروه هوادار</h3>
                        <div className={modal.meta}>
                            <span>18/2/1400 - ساعت 18</span>
                            <span>ظرفیت 50/10</span>
                        </div>
                    </div>
                </div>
                <div className={modal.body}>
                    <div className={modal.message}>
                        آیا از ثبت نام خود مطمئن هستید؟
                    </div>
                    <div className={modal.warning}>
                        <MdOutlineWarningAmber />
                        درصورت کنسلی 10 امتیاز از شما کسر خواهد شد
                    </div>
                </div>
                <div className={modal.footer}>
                    <button type={"button"} onClick={openSubmittedEventModal}>بله</button>
                    <button type={"button"} onClick={closeConfirmEventModal} className={modal.decline}>خیر</button>
                </div>
            </Modal>

            <Modal isOpen={submittedEventModalIsOpen} onAfterOpen={afterOpenSubmittedEventModal} onRequestClose={closeSubmittedEventModal} overlayClassName={modal.Overlay} className={modal.submittedEventModal}>
                <div className={modal.header}>
                    <img src={'/modal-header.png'} alt={'Modal Header'} />
                </div>
                <div className={modal.body}>
                    <p>
                        <MdCheckCircleOutline />
                        ایونت با موفقیت به پروفایل شما اضافه شد
                    </p>
                </div>
                <div className={modal.footer}>
                    <h3>منتظرتون هستیم</h3>
                    <span className={modal.address}> کافه لند، تهران، ولیعصر، بزرگمهر پاساژ بزرگمهر</span>
                    <time>18/2/1400 - ساعت 18</time>
                </div>
            </Modal>

            <Nav />
        </div>
    )
}

export default Explore