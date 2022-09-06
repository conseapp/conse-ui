import styles from "/styles/pages/auth/login.module.scss";
import Head from "next/head";
import Image from "next/future/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { hasCookie, setCookie } from "cookies-next";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    /**
     * User next.js router.
     * @version 1.0
     */
    const Router = useRouter()

    /**
     * Redirect to home page if access token is present.
     * @version 1.0
     */
    useEffect( () => {
        if ( hasCookie( 'access_token' ) ) {
            Router.push( '/' )
        }
    }, [ Router ] )

    /**
     * Function to check user information during login.
     * @version 1.0
     * @param e
     * @returns {Promise<void>}
     * @constructor
     */
    const LoginHandle = async e => {
        e.preventDefault()

        // Form inputs
        let form     = e.target,
            username = form.querySelector( '#username' ),
            password = form.querySelector( '#password' ),
            button   = form.querySelector( 'button' )

        // Disable all fields and button
        username.setAttribute( 'disabled', 'disabled' )
        password.setAttribute( 'disabled', 'disabled' )
        button.setAttribute( 'disabled', 'disabled' )

        // Send username & password to API
        let response         = await fetch( `${ process.env.AUTH_URL }/auth/login`, {
            method:  'post',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify( {
                "username": username.value,
                "pwd":      password.value
            } )
        } )
        let { data, status } = await response.json()

        // Check if request doesn't have any error
        if ( status === 200 ) {
            toast.success( 'شما با موفقیت وارد شدید' )
            setCookie( 'access_token', btoa( JSON.stringify( data ) ) )
            setTimeout( () => Router.push( '/' ), 2000 )
        } else {
            toast.error( 'خطایی در هنگام بررسی اطلاعات پیش آمده لطفا دوباره امتحان کنید' )

            username.removeAttribute( 'disabled' )
            password.removeAttribute( 'disabled' )
            button.removeAttribute( 'disabled' )
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
                    <form onSubmit={ LoginHandle }>

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
                            <button type={ "submit" }>ورود به حساب کاربری</button>
                        </div>

                        <div className={ styles.row }>
                            <div className={ styles.footer }>
                                حساب کاربری ندارید ؟
                                <Link href={ "/auth/signup" }>
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