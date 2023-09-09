import styles from "/styles/pages/auth/login-otp.module.scss";
import Head from "next/head";
import Image from "next/future/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import logo from "../../public/logo-white.png";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
import checkOtp from "/utils/checkOtp";
import { hasCookie, setCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { getuser } from "../../redux/actions";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import OtpInput from 'react-otp-input';
import Timer from "../../components/Timer";


const Login = () => {
    const router = useRouter()
    const [redirect, setRedirectUrl] = useState('/')
    const [phNumber, setPhNumber] = useState('')
    const [otp, setOtp] = useState('')
    const [isDisabled, setisDisabled] = useState(false)
    const [isPhDisabled, setisPhDisabled] = useState(false)
    const [showOtp, setShowOtp] = useState(false)
    const [expiryTime, setExpiryTime] = useState('')
    const [isExpired, setIsExpired] = useState(false)


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
            router.push('/mafia/home')
        else if (globalUser && globalUser.isLoggedIn)
            router.push('/mafia/profile')
    }, [router])

    /**
     * Function to request the otp code.
     *
     * @version 1.0
     * @returns {Promise<void>}
     * @constructor
     * @param event
     */
    const otpReqHandle = async event => {
        event.preventDefault()
        // Errors
        let errors = 0

        if (phNumber.length === 0) {
            toast.error("شماره همراه خود را وارد کنید");
            errors++
        } else if (phNumber.slice(0, 2) !== '09') {
            toast.error("شماره همراه خود را درست وارد کنید");
            errors++
        } else if (phNumber.length !== 11) {
            toast.error("شماره همراه باید شامل 11 رقم باشد");
            errors++
        }

        // Send request to server if there is no errors
        if (errors === 0) {

            // Disable all fields
            setisPhDisabled(true)

            // sending request
            let request = await fetch(`${process.env.AUTH_URL}/auth/otp-req`, {
                method: 'POST',
                body: JSON.stringify({
                    "phone": phNumber,
                })
            })
            let response = await request.json()

            if (response.status === 200) {
                const time = new Date();
                // Show message
                toast.success('رمز یکبار مصرف برای شما ارسال شد')
                setExpiryTime(time.setSeconds(time.getSeconds() + 120))
                setShowOtp(true)

            } else {
                // Show message
                if (response.status === 404)
                    toast.error('اطلاعات وارد شده صححیح نمیباشد')
                else
                    toast.error('خطایی در هنگام ورود به حساب پیش آمده')
                // Enable login button
                setisPhDisabled(false)
            }
        }
    }

    /**
     * Function to check otp code.
     *
     * @version 1.0
     * @returns {Promise<void>}
     * @constructor
     * @param event
     */
    const otpCheckHandle = async event => {
        event.preventDefault()

        // Errors
        let errors = 0
        if (otp.length !== 4) {
            toast.error("رمز یکبار مصرف را وارد کنید");
            errors++
        }

        // Send request to server if there is no errors
        if (errors === 0) {

            // Disable all fields
            setisDisabled(true)

            // check otp
            let time = Math.floor(new Date().getTime() / 1000);
            let response = await checkOtp(phNumber, otp, time)
            console.log(response);

            if (response.status === 200) {
                // Show message
                toast.success('شما با موفقیت وارد شدید')

                // Set access token to cookie
                localStorage.setItem("loginresp", JSON.stringify(response))

                // Redirect to home page
                response.data.access_level === 2 ?
                    setTimeout(() => router.push('/mafia/home'), 2000)
                    :
                    setTimeout(() => router.push('/mafia/profile'), 2000)
            } else {
                // Show message
                if (response.status === 404)
                    toast.error('کد وارد شده صححیح نمیباشد')
                else
                    toast.error('خطایی در هنگام ورود به حساب پیش آمده')
                // Enable login button
                setisDisabled(false);
            }
        }
    }

    const resendOtp = async () => {
        let request = await fetch(`${process.env.AUTH_URL}/auth/otp-req`, {
            method: 'POST',
            body: JSON.stringify({
                "phone": phNumber,
            })
        })
        let response = await request.json()

        if (response.status === 200) {
            const time = new Date();
            // Show message
            toast.success('رمز یکبار مصرف برای شما ارسال شد')
            setExpiryTime(time.setSeconds(time.getSeconds() + 120))
            setisDisabled(false)
            setIsExpired(false)


        } else {
            // Show message
            if (response.status === 404)
                toast.error('اطلاعات وارد شده صححیح نمیباشد')
            else
                toast.error('خطایی در هنگام ورود به حساب پیش آمده')
        }
    }

    const handleExpire = () => {
        setIsExpired(true)
        setisDisabled(true)
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

                {
                    showOtp ?
                        <form onSubmit={otpCheckHandle} className={`${styles.form} ${styles.otp}`}>
                            <div className={styles.icon}>
                                <BsFillShieldLockFill size={30} />
                            </div>

                            <label htmlFor={"otp-code"}>رمز یکبار مصرف را وارد نمایید</label>
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                numInputs={4}
                                renderInput={(props) => <input {...props} disabled={isDisabled} />}
                                containerStyle={{ direction: "ltr" }}
                                inputType="number"
                                inputStyle={{ minWidth: '1rem', width: '50px', height: '50px', padding: '0', margin: '4px' }}
                            />

                            <button type={"submit"} id={"submit-otp"} disabled={isDisabled}>تایید</button>
                            {
                                isExpired ?
                                    <div className={styles.resend}>
                                        <div>مهلت رمز یکبار مصرف به اتمام رسید</div>
                                        <button type={"button"} id={"resend"} onClick={resendOtp}>ارسال مجدد</button>
                                    </div>
                                    :
                                    <Timer expiryTimestamp={expiryTime} onExpire={handleExpire} />
                            }
                        </form>
                        :
                        <form onSubmit={otpReqHandle} className={`${styles.form} ${styles.otp}`}>
                            <div className={styles.icon}>
                                <BsTelephoneFill size={30} />
                            </div>

                            <label htmlFor={"ph-number"}>شماره موبایل خود را وارد کنید</label>
                            <input
                                type="number"
                                value={phNumber}
                                id="ph-number"
                                name="ph-number"
                                placeholder="09*********"
                                dir="ltr"
                                onChange={(e) => setPhNumber(e.target.value)}
                                disabled={isPhDisabled}
                            />

                            <button type={"submit"} id={"submit-ph"} disabled={isPhDisabled}>ارسال کد</button>

                            {/* <div className={styles.row}>
                                <div className={styles.footer}>
                                    حساب کاربری ندارید ؟
                                    <Link href={"/signup"}>
                                        <a>
                                            ثبت نام کنید
                                        </a>
                                    </Link>
                                </div>
                            </div> */}
                        </form>
                }



            </div>

            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />

        </div>
    )
}

export default Login