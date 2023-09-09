import styles from '/styles/pages/index.module.scss'
import Head from "next/head";
import Header from "/components/header";
import Link from "next/link";
import { MdChevronLeft } from "react-icons/md";
// import { useEffect } from "react";
import { useRouter } from "next/router";
// import 'logo.png' from "'logo.png'.png";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Alert from "../components/alert";
import { FaMapMarkerAlt } from "react-icons/fa";
import { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import CreateSideColor from "../utils/createSideColor";
import Image from 'next/image';

// import { getuser } from '../redux/actions';

const Index = props => {
    const router = useRouter()

    const { globalUser } = useSelector(state => state.userReducer)

    useEffect(() => {
        if (globalUser && globalUser.isLoggedIn && (globalUser.access_level === 0)) {
            router.push('/profile')
        }
        if (globalUser && globalUser.isLoggedIn && (globalUser.access_level === 2)) {
            router.push('/home')
        }
    }, [globalUser])

    return (
        (globalUser && globalUser.isLoggedIn) ?
            <div className='container'><Circular /></div>
            : <div className={styles.page}>
                <Head>
                    <title>کنسه</title>
                </Head>
            </div>

    )

}


export default Index