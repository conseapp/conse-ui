import styles from "/styles/pages/auth/login.module.scss";
import Head from "next/head";
import Image from "next/future/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import logo from "../public/logo-white.png";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import loginUser from "/utils/loginUser";
import { hasCookie, setCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { getuser } from "../redux/actions";

const Login = () => {
    const router = useRouter()
    const [redirect, setRedirectUrl] = useState('/')

    const dispatch = useDispatch();
    const fetchUser = () => dispatch(getuser());
    React.useEffect(() => {
        fetchUser();
    }, []);

    const { globalUser } = useSelector(state => state.userReducer)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let params = new URLSearchParams(window.location.search)
            if (params.get('redirect') !== null) {
                setRedirectUrl(params.get('redirect'))
            }

        }
    }, [])


    useEffect(() => {
        // Redirect to another page instead of going back
        router.beforePopState(({ url, as }) => {
            if (as !== '/') {
                router.push('/');
                return false;
            }
            return true;
        });
        return () => {
            router.beforePopState(() => true);
        };
    }, [router]);
    /**
     * Redirect to home page if access token is present.
     * @version 1.0
     */
    useEffect(() => {
        // if (hasCookie('token')) router.push(redirect).then()
        if (globalUser && globalUser.isLoggedIn && globalUser.access_level === 2)
            router.push('/home')
        else if (globalUser && globalUser.isLoggedIn)
            router.push('/profile')
    }, [redirect, router])

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
        let username = document.getElementById('username'),
            password = document.getElementById('password'),
            button = document.getElementById('submit')
        // Errors
        let errors = 0
        if (username.value === '') {
            errors++
            toast.error('نام و نام خانوادگی نمیتواند خالی باشد')
        }
        if (password.value === '') {
            errors++
            toast.error('کلمه عبور نمیتواند خالی باشد')
        }

        // Send request to server if there is no errors
        if (errors === 0) {

            // Disable all fields
            username.setAttribute('disabled', 'disabled')
            password.setAttribute('disabled', 'disabled')
            button.setAttribute('disabled', 'disabled')

            // Login user
            let response = await loginUser(username.value.toLowerCase(), password.value)
            console.log(response)
            if (response.status === 200) {
                // Show message
                toast.success('شما با موفقیت وارد شدید')

                // Set access token to cookie
                localStorage.setItem("loginresp", JSON.stringify(response))

                // Redirect to home page
                response.data.access_level === 1 ?
                    setTimeout(() => router.push('/profile'), 2000)
                    :
                    setTimeout(() => router.push(redirect), 2000)
            } else {
                // Show message
                if (response.status === 404)
                    toast.error('اطلاعات وارد شده صححیح نمیباشد')
                else
                    toast.error('خطایی در هنگام ورود به حساب پیش آمده')
                // Enable login button
                username.removeAttribute('disabled')
                password.removeAttribute('disabled')
                button.removeAttribute('disabled')
            }
        }
    }

    return (
        <div className={styles.page}>

            <Head>
                <title>ورود به حساب کاربری</title>
            </Head>

            <div className={styles.card}>

                <div className={styles.title}>
                    <div className={styles.logo}>
                        <Link href={"/"}>
                            <a>
                                <Image src={logo} alt={"Conse"} width={50} height={50} quality={100} />
                            </a>
                        </Link>
                    </div>
                    <h2>From IA</h2>
                </div>

                <div className={styles.form}>
                    <form onSubmit={loginHandle}>

                        <h3>ورود به حساب کاربری</h3>

                        <div className={styles.row}>
                            <label htmlFor={"username"}>نام و نام خانوادگی</label>
                            <input type="text" id={"username"} name={"username"} />
                        </div>

                        <div className={styles.row}>
                            <label htmlFor={"password"}>کلمه عبور</label>
                            <input type="password" id={"password"} name={"password"} />
                        </div>

                        <div className={styles.row}>
                            <button type={"submit"} id={"submit"}>ورود به حساب کاربری</button>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.footer}>
                                حساب کاربری ندارید ؟
                                <Link href={"/signup"}>
                                    <a>
                                        ثبت نام کنید
                                    </a>
                                </Link>
                            </div>
                        </div>

                    </form>
                </div>

            </div>

            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

export default Login