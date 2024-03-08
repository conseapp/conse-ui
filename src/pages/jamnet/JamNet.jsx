import { useLocation } from "react-router-dom";
import { NavListButton, OutlineLinkButton } from "../../components/ui/navigationButtons"

const JamNet = () => {
    const location = useLocation();

    return (
        <div className='flex flex-col py-10 gap-10 h-custom-screen'>
            <ul className='flex flex-col gap-2 h-full overflow-auto'>
                <li>
                    <NavListButton from={location.pathname} text={'مقالات'} path={'blogs'} />
                </li>
                <li>
                    <NavListButton from={location.pathname} text={'آموزش'} path={'learning'} />
                </li>
            </ul>
        </div>
    )
}

export default JamNet