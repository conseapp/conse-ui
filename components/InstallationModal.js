import React from 'react'
import styles from '../styles/pages/index.module.scss'
import { MdIosShare, MdOutlineAddBox } from "react-icons/md";
import Image from "next/future/image";
import logo from "../public/logo-white.png";

function InstallationModal({ onInstallClick }) {
    return (
        <div className={styles.installationModal}>
            <div className={styles.content}>
                <div className={styles.logo}>
                    <Image src={logo} alt={"Conse"} width={80} height={80} quality={100} />
                    <h4>وب‌اپلیکیشن کنسه را به صفحه اصلی موبایل خود اضافه کنید</h4>
                </div>
                <div className={styles.row}>
                    <p>1 - دکمه <b>share</b> را در نوار پایین کلیک کنید</p>
                    <MdIosShare />
                </div>
                <div className={styles.row}>
                    <p>2 - گزینه <b>Add to Home Screen</b> را انتخاب کنید</p>
                    <MdOutlineAddBox />
                </div>
                <div className={styles.row}>
                    <p>3 - در قسمت بالا روی <b>Add</b> کلیک کنید</p>
                    <b className={styles.add}>Add</b>
                </div>
            </div>
            <button onClick={onInstallClick}>متوجه شدم</button>
        </div>
    )
}

export default InstallationModal