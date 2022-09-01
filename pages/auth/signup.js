import styles from "/styles/pages/auth/login.module.scss";
import Head from "next/head";
import Image from "next/future/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { hasCookie, setCookie } from "cookies-next";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const Router = useRouter()

    useEffect( () => {
        if ( hasCookie( 'access_token' ) ) {
            Router.push( '/' )
        }
    }, [ Router ] )

    const LoginHandle = async e => {
        e.preventDefault()

        // Form inputs
        let form             = e.target,
            username         = form.querySelector( '#username' ),
            password         = form.querySelector( '#password' ),
            password_confirm = form.querySelector( '#password_confirm' ),
            button           = form.querySelector( 'button' )

        // Check password and confirm password fields
        if ( password.value !== password_confirm.value ) {
            toast.error( 'کلمه عبور و تکرار آن با یکدیگر برابر نیستند' )
            return
        }

        // Disable all fields and button
        username.setAttribute( 'disabled', 'disabled' )
        password.setAttribute( 'disabled', 'disabled' )
        password_confirm.setAttribute( 'disabled', 'disabled' )
        button.setAttribute( 'disabled', 'disabled' )

        // Send username & password to API
        let register   = await fetch( `${ process.env.AUTH_URL }/auth/signup`, {
            method:  'post',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify( {
                "username": username.value,
                "pwd":      password.value,
                "phone":    "09120000000",
                "status":   2
            } )
        } )
        let { status } = await register.json()

        // Check if request doesn't have any error
        if ( status === 200 ) {
            fetch( `${ process.env.AUTH_URL }/auth/login`, {
                method:  'post',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify( {
                    "username": username.value,
                    "pwd":      password.value
                } )
            } )
                .then( response => response.json() )
                .then( ( { data, status } ) => {
                    if ( status === 200 ) {
                        toast.success( 'ثبت نام شما با موفقیت انجام شد' )

                        let encode = btoa( JSON.stringify( data ) )
                        setCookie( 'access_token', encode )

                        setTimeout( () => Router.push( '/' ), 2000 )
                    } else {
                        toast.error( 'خطایی در هنگام بررسی اطلاعات پیش آمده لطفا دوباره امتحان کنید' )

                        username.removeAttribute( 'disabled' )
                        password.removeAttribute( 'disabled' )
                        password_confirm.removeAttribute( 'disabled' )
                        button.removeAttribute( 'disabled' )
                    }
                } )
                .catch( error => console.error( error ) )
        } else {
            toast.error( 'خطایی در هنگام بررسی اطلاعات پیش آمده لطفا دوباره امتحان کنید' )

            username.removeAttribute( 'disabled' )
            password.removeAttribute( 'disabled' )
            password_confirm.removeAttribute( 'disabled' )
            button.removeAttribute( 'disabled' )
        }
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>ثبت نام در کنسه</title>
            </Head>

            <div className={ styles.card }>

                <div className={ styles.title }>
                    <Image src={ "/logo.png" } alt={ "Conse" } width={ 112 } height={ 55 } />
                    <h2>From IA</h2>
                </div>

                <div className={ styles.form }>
                    <form onSubmit={ LoginHandle }>

                        <h3>ثبت نام در کنسه</h3>

                        <div className={ styles.row }>
                            <label htmlFor={ "username" }>نام کاربری</label>
                            <input type="text" id={ "username" } name={ "username" } />
                        </div>

                        <div className={ styles.row }>
                            <label htmlFor={ "password" }>کلمه عبور</label>
                            <input type="password" id={ "password" } name={ "password" } />
                        </div>

                        <div className={ styles.row }>
                            <label htmlFor={ "password_confirm" }>تایید کلمه عبور</label>
                            <input type="password" id={ "password_confirm" } name={ "password_confirm" } />
                        </div>

                        <div className={ styles.row }>
                            <button type={ "submit" }>ثبت نام</button>
                        </div>

                        <div className={ styles.row }>
                            <div className={ styles.footer }>
                                <Link href={ "/auth/login" }>
                                    <a>
                                        ورود به حساب کاربری
                                    </a>
                                </Link>
                            </div>
                        </div>

                    </form>
                </div>

            </div>

            <ToastContainer position="bottom-center" autoClose={ 3000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

export default Register