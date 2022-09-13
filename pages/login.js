import styles from "/styles/pages/auth/login.module.scss";
import Head from "next/head";
import Image from "next/future/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import loginUser from "/utils/loginUser";
import { hasCookie, setCookie } from "cookies-next";

const Login = () => {
    /**
     * Use next.js router.
     *
     * @version 1.0
     */
    const router = useRouter()

    /**
     * Redirect to home page if access token is present.
     * @version 1.0
     */
    useEffect( () => {
        if ( hasCookie( 'token' ) ) router.push( '/' ).then()
    }, [ router ] )

    /**
     * Function to check user information during login.
     *
     * @version 1.0
     * @returns {Promise<void>}
     * @constructor
     * @param event
     */
    const loginHandle = async event => {
        event.preventDefault()

        // Form
        let username = document.getElementById( 'username' ),
            password = document.getElementById( 'password' ),
            button   = document.getElementById( 'submit' )

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

        // Send request to server if there is no errors
        if ( errors === 0 ) {

            // Disable all fields
            username.setAttribute( 'disabled', 'disabled' )
            password.setAttribute( 'disabled', 'disabled' )
            button.setAttribute( 'disabled', 'disabled' )

            // Login user
            let response = await loginUser( username.value, password.value )

            if ( response.status === 200 ) {
                // Show message
                toast.success( 'شما با موفقیت وارد شدید' )

                // Set access token to cookie
                setCookie( 'token', response.data.access_token )

                // Redirect to home page
                setTimeout( () => router.push( '/' ), 2000 )
            } else {
                // Show message
                toast.error( 'خطایی در هنگام ورود به حساب پیش آمده' )

                // Enable login button
                username.removeAttribute( 'disabled' )
                password.removeAttribute( 'disabled' )
                button.removeAttribute( 'disabled' )
            }
        }
    }

    return (
        <div className={ styles.page }>

            <Head>
                <title>ورود به حساب کاربری</title>
            </Head>

            <div className={ styles.card }>

                <div className={ styles.title }>
                    <Image src={ "/logo.png" } alt={ "Conse" } width={ 112 } height={ 55 } />
                    <h2>From IA</h2>
                </div>

                <div className={ styles.form }>
                    <form onSubmit={ loginHandle }>

                        <h3>ورود به حساب کاربری</h3>

                        <div className={ styles.row }>
                            <label htmlFor={ "username" }>نام کاربری</label>
                            <input type="text" id={ "username" } name={ "username" } />
                        </div>

                        <div className={ styles.row }>
                            <label htmlFor={ "password" }>کلمه عبور</label>
                            <input type="password" id={ "password" } name={ "password" } />
                        </div>

                        <div className={ styles.row }>
                            <button type={ "submit" } id={ "submit" }>ورود به حساب کاربری</button>
                        </div>

                        <div className={ styles.row }>
                            <div className={ styles.footer }>
                                حساب کاربری ندارید ؟
                                <Link href={ "/signup" }>
                                    <a>
                                        ثبت نام کنید
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

export default Login