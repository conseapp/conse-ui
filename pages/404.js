import styles from '/styles/pages/learn.module.scss'
import Nav from "../components/nav";
import React from "react";
import Header from "../components/header";
import Link from 'next/link';

const NotFound = props => {
    const { user, sides, roles, cards } = props

    return (
        <div className={styles.page}>

            <Header user={user} profile={false} />

            <Nav user={user} />

            <div className={"container"}>
                <div style={{ display: "flex", margin: "20 auto", flexDirection: "column", textAlign: "center" }}>
                    <p>
                        صفحه ی مورد نظر یافت نشد
                    </p>
                    <Link href="/" >
                        <p style={{ color: "darkblue" , marginTop:"100px"}}>
                            بازگشت به خانه
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;