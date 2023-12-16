import React, { useState } from 'react'
import { FaPhoneAlt } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { PhoneInput } from '../components/ui/inputs';
import { SubmitButton, RegularButton } from '../components/ui/buttons';
import OTPInput from 'react-otp-input';
import Timer from '../components/ui/Timer';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { requestOTP, checkOTP } from '../api/authApi'
import { useDispatch } from 'react-redux';
import { getuser } from '../redux/actions';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const fetchUser = (token) => dispatch(getuser(token));
  const [phNumber, setPhNumber] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState('')
  const [isDisabled, setisDisabled] = useState(false)
  const [isPhDisabled, setisPhDisabled] = useState(false)
  const [expiryTime, setExpiryTime] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  const checkPhNum = (phoneNum) => {
    let errors = 0

    if (phoneNum.length === 0) {
      toast.error("شماره همراه خود را وارد کنید");
      errors++
    } else if (phoneNum.slice(0, 2) !== '09') {
      toast.error("شماره همراه خود را درست وارد کنید");
      errors++
    } else if (phoneNum.length !== 11) {
      toast.error("شماره همراه باید شامل 11 رقم باشد");
      errors++
    }

    return errors
  }

  const otpReqHandle = async e => {
    e.preventDefault()

    const errors = checkPhNum(phNumber)

    if (errors === 0 || true) {

      setisPhDisabled(true)

      const response = await requestOTP({ phone: phNumber })

      if (response.status === 200 || response.status === 201) {
        const time = new Date();

        toast.success('رمز یکبار مصرف برای شما ارسال شد')
        setExpiryTime(time.setSeconds(time.getSeconds() + 120))
        setShowOtp(true)

      } else {
        setisPhDisabled(false)

        if (response.status === 404)
          toast.error('اطلاعات وارد شده صححیح نمیباشد')
        else
          toast.error('خطایی در هنگام ورود به حساب پیش آمده')
      }
    }
  }

  const resendOtp = async () => {
    const response = await requestOTP({ phone: phNumber })

    if (response.status === 200) {
      const time = new Date();

      toast.success('رمز یکبار مصرف برای شما ارسال شد')
      setExpiryTime(time.setSeconds(time.getSeconds() + 120))
      setisDisabled(false)
      setIsExpired(false)
    } else {
      if (response.status === 404)
        toast.error('اطلاعات وارد شده صححیح نمیباشد')
      else
        toast.error('خطایی در هنگام ورود به حساب پیش آمده')
    }
  }

  const otpCheckHandle = async event => {
    event.preventDefault()

    setisDisabled(true)

    // check otp
    let time = Math.floor(new Date().getTime() / 1000);
    let response = await checkOTP({ phone: phNumber, code: otp, time: time })

    if (response.status === 200) {
      toast.success('شما با موفقیت وارد شدید')
      fetchUser(response.data.access_token)
    } else {
      setisDisabled(false);

      if (response.status === 404)
        toast.error('کد وارد شده صححیح نمیباشد')
      else
        toast.error('خطایی در هنگام ورود به حساب پیش آمده')
    }

  }

  const handleExpire = () => {
    setIsExpired(true)
    setisDisabled(true)
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      {
        showOtp ?
          <form onSubmit={otpCheckHandle} className='flex flex-col w-11/12 xs:max-w-md bg-navy rounded-lg px-4 xs:px-8 py-12 gap-12' >
            <div className='w-full flex flex-col items-center gap-8'>
              <BsFillShieldLockFill size={30} />
              <label
                htmlFor={"otp-code"}
                className="block text-center">
                رمز یکبار مصرف را وارد نمایید
              </label>

              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderInput={(props) => <input {...props} disabled={isDisabled} style={{}} />}
                containerStyle={'flex flex-row-reverse gap-2'}
                inputType="number"
                inputStyle={"w-[50px] h-[50px] text-center border bg-navy border-gray placeholder-gray-light text-white focus-visible:ring-secondary focus-visible:border-secondary focus-visible:outline-none text-sm rounded-lg p-2.5 "}
              />
            </div>
            <div className='w-full flex flex-col items-center gap-8'>
              {
                isExpired ?
                  <>
                    <div>مهلت رمز یکبار مصرف به اتمام رسید</div>
                    <RegularButton text="ارسال مجدد" id={"resend"} onClick={resendOtp} />
                  </>
                  :
                  <>
                    <SubmitButton text="تایید" id={"submit-otp"} disabled={isDisabled || otp.length !== 4} />
                    <Timer expiryTimestamp={expiryTime} onExpire={handleExpire} />
                  </>
              }
            </div>
          </form>
          :
          <form onSubmit={otpReqHandle} className='flex flex-col w-11/12 xs:max-w-md bg-navy rounded-lg px-4 xs:px-8 py-16 gap-16'>
            <div className='w-full flex flex-col items-center gap-8'>
              <FaPhoneAlt size={30} />
              <label
                htmlFor="phone"
                className="block text-center">
                شماره موبایل خود را وارد کنید
              </label>
              <PhoneInput
                id="phone"
                value={phNumber}
                onChange={(e) => setPhNumber(e.target.value)}
                disabled={isPhDisabled}
              />
            </div>
            <SubmitButton text="ارسال کد" id={"submit-ph"} disabled={isPhDisabled} />
          </form>
      }
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar newestOnTop={false} closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover theme="dark" />

    </div>
  )
}

export default Login