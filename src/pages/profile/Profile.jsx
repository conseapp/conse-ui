import { useDispatch, useSelector } from 'react-redux';
import { logout, resetPhaseState } from '../../redux/actions';
import { IoLogOutOutline } from "react-icons/io5";
import { useLocation } from 'react-router-dom';
import { NavListButton } from '../../components/ui/navigationButtons';


const Profile = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const globalUser = useSelector(state => state.userReducer)

  const handleLogout = () => { 
    dispatch(logout())
    dispatch(resetPhaseState())
   }
  return (
    <div className='flex flex-col py-10 gap-10'>
      <ul className='flex flex-col gap-2'>
        <li>
          <NavListButton from={location.pathname} text={'اطلاعات حساب کاربری'} path={'user-acount-info'} />
        </li>
        {
          (globalUser.accessLevel == 0 || globalUser.accessLevel == 1) &&
          <li>
            <NavListButton from={location.pathname} text={'ایونت های من'} path={'god-events'} />
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