import styles from "/styles/pages/auth/login.module.scss";
import Head from "next/head";
import Image from "next/future/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { hasCookie, setCookie } from "cookies-next";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import signupUser from "../utils/signupUser";
import loginUser from "../utils/loginUser";

const Register = () => {
    /**
     * Use next.js router.
     *
     * @version 1.0
     */
    const router = useRouter()

    /**
     * Redirect to home page if access token is present.
     *
     * @version 1.0
     */
    useEffect( () => {
        if ( hasCookie( 'token' ) ) router.push( '/' ).then()
    }, [ router ] )

    /**
     * Function to check user information during signup.
     *
     * @version 1.0
     * @param e
     * @returns {Promise<void>}
     * @constructor
     */
    const RegisterHandle = async e => {
        e.preventDefault()

        // Form inputs
        let form     = e.target,
            username = form.querySelector( '#username' ),
            password = form.querySelector( '#password' ),
            confirm  = form.querySelector( '#password_confirm' ),
            button   = form.querySelector( 'button' )

        // Errors
        let errors = 0
        if ( username.value === '' ) {
            errors++
            toast.error( 'نام کاربری نمیتواند خالی باشد' )
        }
        if ( password.value === '' ) {
            errors++
            toast.error( 'کلمه عبور نمیتواند خالی باشد' )
        }
        if ( password.value !== confirm.value ) {
            errors++
            toast.error( 'کلمه عبور و تکرار آن با یکدیگر برابر نیستند' )
        }

        console.log( username.value.match( /^[a-zA-Z]|[\u0600-\u06FF\s]+$/ ) )

        if ( username.value.match( /^[a-zA-Z]|[\u0600-\u06FF\s]+$/ ) === null ) {
            errors++
            toast.error( 'برای نام کاربری تنها حروف مجاز است' )
        }

        // Send request to server if there is no errors
        if ( errors === 0 ) {

            // Disable all fields and button
            username.setAttribute( 'disabled', 'disabled' )
            password.setAttribute( 'disabled', 'disabled' )
            confirm.setAttribute( 'disabled', 'disabled' )
            button.setAttribute( 'disabled', 'disabled' )

            // Signup user
            let signup = await signupUser( username.value, password.value )

            if ( signup.status === 200 ) {

                // Login User
                let login = await loginUser( username.value, password.value )

                if ( login.status === 200 ) {
                    // Show message
                    toast.success( 'ثبت نام شما با موفقیت انجام شد' )

                    // Set access token to cookie
                    setCookie( 'token', login.data.access_token )

                    // Redirect to home page
                    setTimeout( () => router.push( '/' ), 2000 )
                } else {
                    // Show message
                    toast.error( 'خطایی در هنگام ثبت نام پیش آمده لطفا دوباره امتحان کنید' )

                    // Enable login button
                    username.removeAttribute( 'disabled' )
                    password.removeAttribute( 'disabled' )
                    confirm.removeAttribute( 'disabled' )
                    button.removeAttribute( 'disabled' )
                }
            } else {
                // Show message
                toast.error( 'خطایی در هنگام ثبت نام پیش آمده لطفا دوباره امتحان کنید' )

                // Enable login button
                username.removeAttribute( 'disabled' )
                password.removeAttribute( 'disabled' )
                confirm.removeAttribute( 'disabled' )
                button.removeAttribute( 'disabled' )
            }
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
                    <form onSubmit={ RegisterHandle }>

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
                                <Link href={ "/login" }>
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