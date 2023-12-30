import { useLocation } from "react-router-dom";
import { NavListButton } from "../../components/ui/navigationButtons"

const Manage = () => {
  const location = useLocation();
  
  return (
    <div className='flex flex-col py-10 gap-10'>
      <ul className='flex flex-col gap-2'>
        <li>
          <NavListButton from={location.pathname} text={'مدریت ایونت‌ها'} path={'events'} />
        </li>
      </ul>
    </div>
  )
}

export default Manage