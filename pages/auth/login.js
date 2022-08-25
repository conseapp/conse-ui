import styles from '../../assets/scss/Login.module.css'
import Image from "next/image"
import React from "react";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";

const Login = () => {
    const router = useRouter()

    const loginHandle = async e => {
        e.preventDefault()

        let form     = document.querySelector( "form" ),
            username = form.querySelector( '#username' ),
            password = form.querySelector( '#pwd' )

        const raw = JSON.stringify( {
            "username": username.value,
            "pwd":      password.value,
        } )

        const config = {
            method:  'post',
            headers: { 'Content-Type': 'application/json' },
            body:    raw,
        }

        fetch( `${ process.env.AUTH_URL }/auth/login`, config )
            .then( response => response.json() )
            .then( data => {
                if ( data.status !== 200 ) {
                    toast.error( 'خطایی پیش آمده لطفا دوباره امتحان کنید' )
                } else {
                    toast.success( 'با موفقیت وارد شدید' )
                    setCookie( 'access_token', data.data.access_token )
                    setTimeout( () => router.push( '/' ), 2000 )
                }
            } )
    }

    return (
        <div className={ styles.page }>
            <div className={ styles.card }>
                <div className={ styles.title }>
                    <Image src={ "/logo.png" } alt={ "Conse" } width={ 112 } height={ 55 } />
                    <h2>From irCO</h2>
                </div>

                <div className={ styles.form }>
                    <form method={ "POST" } onSubmit={ loginHandle }>
                        <h3>ورود</h3>
                        <div className={ styles.row }>
                            <label htmlFor={ "username" }>نام کاربری</label>
                            <input type="text" id={ "username" } name={ "username" } />
                        </div>
                        <div className={ styles.row }>
                            <label htmlFor={ "pwd" }>کلمه عبور</label>
                            <input type="password" id={ "pwd" } name={ "pwd" } />
                        </div>
                        <button type={ "submit" }>ورود به حساب کاربری</button>
                    </form>
                </div>

                <ToastContainer position="bottom-center" autoClose={ 5000 } hideProgressBar newestOnTop={ false } closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
            </div>
        </div>
    )
}

export default Login