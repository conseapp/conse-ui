import styles from '/styles/pages/index.module.scss'
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Image from "next/future/image";
import logo from "../public/logo-white.png";
import Link from 'next/link';


// import { getuser } from '../redux/actions';

const Index = props => {
    const router = useRouter()

    const { globalUser } = useSelector(state => state.userReducer)

    useEffect(() => {
        if (globalUser && globalUser.isLoggedIn && (globalUser.access_level === 0)) {
            router.push('/mafia/profile')
        }
        if (globalUser && globalUser.isLoggedIn && (globalUser.access_level === 2)) {
            router.push('/mafia/home')
        }
    }, [globalUser])

    return (
        (globalUser && globalUser.isLoggedIn) ?
            <div className='container'><Circular /></div>
            : <div className={styles.page}>
                <Head>
                    <title>کنسه</title>
                </Head>
                <div className={styles.logo}>
                    <Image src={logo} alt={"Conse"} width={150} height={150} quality={100} />
                </div>
                <h1>به کنسه خوش آمدید!</h1>
                <span>برای ورود لطفا
                    <Link href={"/mafia/login"}>
                        <a>
                            &nbsp;اینجا&nbsp;
                        </a>
                    </Link>
                    کلیک کنید</span>
                <div className={styles.footer}>From IA</div>
            </div>

    )

}


export default Index