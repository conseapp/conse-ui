import styles from '../../assets/scss/Login.module.css'
import Image from "next/image"
import React from "react";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";

const Login = () => {
    const router = useRouter()
    /*const [ number, setNumber ] = useState( '' )

     const HandleNumber = e => setNumber( e.target.value )

     const HandleLogin = () => {
     let error = ''

     if ( number === '' ) {
     error = 'شماره تلفن نمیتواند خالی باشد'
     } else {
     if ( !number.startsWith( '09' ) || number.length !== 11 ) {
     error = 'فرمت شماره تلفن صحیح نیست'
     }
     }

     if ( error.length > 0 ) {
     toast.error( error, {
     position:        "bottom-center",
     autoClose:       5000,
     hideProgressBar: true,
     closeOnClick:    true,
     pauseOnHover:    true,
     draggable:       true,
     progress:        undefined,
     } );
     } else {
     document.querySelector( `.${ styles.form }` ).classList.add( `${ styles.hide }` )
     document.querySelector( `.${ styles.confirm }` ).classList.remove( `${ styles.hide }` )
     }
     }

     const ChangeNumber = () => {
     document.querySelector( `.${ styles.confirm }` ).classList.add( `${ styles.hide }` )
     document.querySelector( `.${ styles.form }` ).classList.remove( `${ styles.hide }` )
     }*/

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
                    toast.error( 'خطایی پیش آمده لطفا دوباره امتحان کنید' );
                } else {
                    setCookie( 'access_token', data.data.access_token )
                    toast.success( 'با موفقیت وارد شدید', {
                        position:        "bottom-center",
                        autoClose:       5000,
                        hideProgressBar: true,
                        closeOnClick:    true,
                        pauseOnHover:    true,
                        draggable:       true,
                        progress:        undefined,
                    } )
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

                {/*<div className={styles.form}>*/ }
                {/*    <label htmlFor={"number"}>تلفن همراه:</label>*/ }
                {/*    <input type={"number"} id={"number"} placeholder={"مثال: 09123456789"} onChange={HandleNumber} />*/ }
                {/*    <button type={"button"} onClick={HandleLogin}>دریافت کد ورود</button>*/ }
                {/*</div>*/ }

                {/*<div className={`${styles.confirm} ${styles.hide}`}>*/ }
                {/*    <span>کد تایید برای شما ارسال شد</span>*/ }
                {/*    <label htmlFor={"code"}>کد تایید به شماره {number} ارسال شده</label>*/ }
                {/*    <input type={"code"} id={"code"} />*/ }
                {/*    <button type={"button"} className={styles.back} onClick={ChangeNumber}>تغییر شماره</button>*/ }
                {/*    <button type={"button"}>ورود</button>*/ }
                {/*</div>*/ }
            </div>
        </div>
    )
}

export default Login