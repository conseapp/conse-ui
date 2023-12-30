import { useState } from 'react'
import { InputOutline, PhoneInput } from '../components/ui/inputs';
import { SubmitButton, RegularButton } from '../components/ui/buttons';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { loginUser } from '../api/authApi'
import { useDispatch } from 'react-redux';
import { getuser } from '../redux/actions';

const OldLogin = () => {
  const dispatch = useDispatch();
  const fetchUser = (token) => dispatch(getuser(token));
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isDisabled, setisDisabled] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    setisDisabled(true)

    let response = await loginUser({ username: username, pwd: password })

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

  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <form onSubmit={handleLogin} className='flex flex-col w-11/12 xs:max-w-md bg-navy rounded-lg px-4 xs:px-8 py-8 gap-8'>
        <div className='w-full flex flex-col items-end gap-4'>
          <label
            htmlFor="phone"
            className="block text-center">
            :  username
          </label>
          <InputOutline
            id="phone"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isDisabled}
          />
        </div>
        <div className='w-full flex flex-col items-end gap-4'>
          <label
            htmlFor="phone"
            className="block text-center">
            :  password
          </label>
          <InputOutline
          type='password'
            id="phone"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isDisabled}
          />
        </div>
        <SubmitButton text="ورود" id={"submit-ph"} disabled={isDisabled} />
      </form>
    </div>
  )
}

export default OldLogin