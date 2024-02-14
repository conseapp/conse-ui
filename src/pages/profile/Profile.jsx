import { useDispatch, useSelector } from 'react-redux';
import { logout, resetPhaseState } from '../../redux/actions';
import { IoLogOutOutline } from "react-icons/io5";
import { useLocation } from 'react-router-dom';
import { NavListButton } from '../../components/ui/navigationButtons';
import { logoutUser } from '../../api/logoutApi';
import { toast } from 'react-toastify';



const Profile = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const globalUser = useSelector(state => state.userReducer)

  const handleLogout = async () => {
    try {
      const response = await logoutUser({ token: globalUser.accessToken, userID: globalUser.id })

      if (response.status === 200) {
        dispatch(logout())
        dispatch(resetPhaseState())
      }
    } catch (error) {
      console.log(error)
      toast.error('خطایی در هنگام خروج از حساب پیش آمده')
      setTimeout(() => {
        dispatch(logout())
        dispatch(resetPhaseState())
      }, 2000);
    }
  }

  return (
    <div className='flex flex-col py-10 gap-10 h-custom-screen'>
      <ul className='flex flex-col gap-2 h-full overflow-auto'>
        <li>
          <NavListButton from={location.pathname} text={'اطلاعات حساب کاربری'} path={'user-acount-info'} />
        </li>
        {
          (globalUser.accessLevel == 1) &&
          <li>
            <NavListButton from={location.pathname} text={'ایونت های من'} path={'god-events'} />
          </li>
        }
        {
          (globalUser.accessLevel == 2) &&
          <li>
            <NavListButton from={location.pathname} text={'ایونت های من'} path={'player-events'} />
          </li>
        }
        {
          (globalUser.accessLevel == 0 || globalUser.accessLevel == 1) &&
          <li>
            <NavListButton from={location.pathname} text={'مدریت ایونت‌ها'} path={'/mafia/manage/events'} />
          </li>
        }
        {
          (globalUser.accessLevel == 0) &&
          <li>
            <NavListButton from={location.pathname} text={'انتخاب گرداننده'} path={'new-god'} />
          </li>
        }
        <li>
          <NavListButton from={location.pathname} text={'promotions'} path={'promotions'} />
        </li>
      </ul>
      <div>
      </div>
      <button className='flex gap-2' onClick={handleLogout}>
        <IoLogOutOutline color='#E74A4A' size={24} />
        خروج از حساب کاربری
      </button>
    </div>
  )
}

export default Profile