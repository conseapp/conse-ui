import styles from '../../assets/scss/Login.module.css'
import Image from "next/image"
import React from "react";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

const Login = () => {
    const router = useRouter()

    const registerHandle = async e => {
        e.preventDefault()

        let form     = document.querySelector( "form" ),
            username = form.querySelector( '#username' ),
            password = form.querySelector( '#pwd' )

        const raw = JSON.stringify( {
            "username": username.value,
            "pwd":      password.value,
            "phone":    "09123456789",
            "status":   0,
        } )

        const config = {
            method:  'post',
            headers: { 'Content-Type': 'application/json' },
            body:    raw,
        }

        fetch( `${ process.env.AUTH_URL }/auth/signup`, config )
            .then( response => response.json() )
            .then( data => {
                if ( data.status !== 200 ) {
                    toast.error( 'خطایی پیش آمده لطفا دوباره امتحان کنید' )
                } else {
                    toast.success( 'ثبت نام شما با موفقیت انجام شد وارد شوید' )
                    setTimeout( () => router.push( '/auth/login' ), 2000 )
                }
            } )
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>ثبت نام در سایت</title>
            </Head>

            <div className={ styles.card }>
                <div className={ styles.title }>
                    <Image src={ "/logo.png" } alt={ "Conse" } width={ 112 } height={ 55 } />
                    <h2>From IA</h2>
                </div>

                <div className={ styles.form }>
                    <form method={ "POST" } onSubmit={ registerHandle }>
                        <h3 style={ { marginBottom: 20 } }>ثبت نام</h3>
                        <div className={ styles.row }>
                            <label htmlFor={ "username" }>نام کاربری</label>
                            <input type="text" id={ "username" } name={ "username" } />
                        </div>
                        <div className={ styles.row }>
                            <label htmlFor={ "pwd" }>کلمه عبور</label>
                            <input type="password" id={ "pwd" } name={ "pwd" } />
                        </div>
                        <button type={ "submit" }>ثبت نام</button>
                        <div style={ { marginTop: 20 } }>
                            حساب کاربری دارید ؟
                            <Link href={ "/auth/login" }>
                                <a>
                                    وارد شوید
                                </a>
                            </Link>
                        </div>
                    </form>
                </div>

                <ToastContainer position="bottom-center" autoClose={ 5000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
            </div>
        </div>
    )
}

export default Login