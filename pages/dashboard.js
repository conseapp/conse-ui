import styles from '../assets/scss/Dashboard.module.css'
import Header from "../components/header";
import Nav from "../components/nav";
import Link from "next/link";

const Dashboard = () => {

    const items = [
        {
            id: 191238,
            name: 'ایونت کارتل ',
            background: '/events-slide-1.png',
            date: '1401/3/4'
        },
        {
            id: 191238,
            name: 'ایونت کارتل ',
            background: '/events-slide-2.png',
            date: '1401/3/4'
        },
        {
            id: 191238,
            name: 'ایونت کارتل ',
            background: '/events-slide-3.png',
            date: '1401/3/4'
        },
        {
            id: 191238,
            name: 'ایونت کارتل ',
            background: '/events-slide-1.png',
            date: '1401/3/4'
        },
        {
            id: 191238,
            name: 'ایونت کارتل ',
            background: '/events-slide-2.png',
            date: '1401/3/4'
        },
        {
            id: 191238,
            name: 'ایونت کارتل ',
            background: '/events-slide-3.png',
            date: '1401/3/4'
        },
    ]

    const openTab = e => {
        let TabNumber = e.target.getAttribute('data-tab')

        let TabNavItems = document.querySelectorAll(`.${styles.tabNav} ul li`)
        TabNavItems.forEach(item => item.classList.remove(styles.active))
        e.target.classList.add(styles.active)

        let Tabs = document.querySelectorAll(`.${styles.tabs} > .${styles.tab}`)
        Tabs.forEach(item => item.classList.remove(styles.active))
        document.querySelector(`.${styles.tabs} > .${styles.tab}#tab-${TabNumber}`).classList.add(styles.active)
    }

    return (
        <div className={styles.page}>
            <Header />

            <div className={styles.tabNav}>
                <ul>
                    <li onClick={openTab} data-tab={1} className={styles.active}>بازی های پیش رو</li>
                    <li onClick={openTab} data-tab={2}>گرداننده</li>
                    <li onClick={openTab} data-tab={3}>تاریخچه</li>
                </ul>
            </div>

            <div className={styles.tabs}>
                <div className={`${styles.tab} ${styles.events} ${styles.active}`} id="tab-1">
                    <ul>
                        {items.map(item => {
                            return (
                                <li key={item.id}>
                                    <Link href={`/event/detail/${item.id}`}>
                                        <a>
                                            <div className={styles.box} style={{backgroundImage: `url(${item.background})`}}>
                                                <h3>{item.name}</h3>
                                                <time>{item.date}</time>
                                            </div>
                                        </a>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>

            <Nav />
        </div>
    )
}

export default Dashboard