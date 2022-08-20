import styles from '../../../../assets/scss/event/Detail.module.css'
import Header from "../../../../components/header";
import Nav from "../../../../components/nav";
import Head from "next/head";
import modal from "../../../../assets/scss/Modal.module.css";
import {MdGames, MdLocationPin} from "react-icons/md";
import {RiUser3Fill} from "react-icons/ri";
import {IoTicket} from "react-icons/io5";
import React from "react";
import Link from "next/link";

const EventDetail = () => {
    return (
        <div className={styles.page}>
            <Head>
                <title>ایونت کارتل</title>
            </Head>

            <Header />

            <img src={'/event-detail-header.png'} className={styles.cover} />

            <div className="container">
                <div className={styles.header}>
                    <div className={styles.title}>
                        <h2>ایونت کارتل</h2>
                        <div className={styles.meta}>
                            <span>ظرفیت 10/50</span>
                            <time>1401/5/11</time>
                        </div>
                    </div>
                </div>

                <div className={styles.body}>
                    <div className={styles.info}>
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
                    <div className={styles.description}>
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

                <div className={styles.footer}>
                    <Link href={'191238/players'}>
                        <a>لیست نفرات ثبت نامی</a>
                    </Link>
                    <button type={"button"}>شروع بازی</button>
                </div>
            </div>

            <Nav />
        </div>
    )
}

export default EventDetail