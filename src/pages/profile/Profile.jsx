import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { NavListButton } from '../../components/ui/navigationButtons';


const Profile = () => {
  const location = useLocation();
  const globalUser = useSelector(state => state.userReducer)

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
        {/* <li>
          <NavListButton from={location.pathname} text={'promotions'} path={'promotions'} />
        </li> */}
      </ul>
      <div>
      </div>
    </div>
  )
}

export default Profile