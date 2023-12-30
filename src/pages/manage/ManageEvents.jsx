import { useSelector } from "react-redux"
import { AddButton, NavListButtonEdit } from "../../components/ui/navigationButtons"
import { useQuery } from "react-query"
import { getGodEvents } from "../../api/eventApi"
import { useLocation } from "react-router-dom"
import Circular from "../../components/ui/Circular"
import { IoWarningOutline } from "react-icons/io5"

const ManageEvents = () => {

    const globalUser = useSelector(state => state.userReducer)
    const location = useLocation()


    const { data: godEvents, isLoading: godEventsIsLoading } =
        useQuery('god-events', () => getGodEvents(globalUser.accessToken), {
            refetchOnWindowFocus: false
        })


    return (
        <div className='h-custom-screen overflow-y-auto flex flex-col gap-6 py-1 relative'>
            <h2 className='text-xl w-full'>مدیریت ایونت‌ها</h2>
            <ul className='flex flex-col gap-2 h-full pl-1 overflow-auto w-full'>
                {
                    godEventsIsLoading ?
                        <Circular /> :
                        godEvents.data?.length ?
                            godEvents.data.map((event, index) => (
                                <li key={`event_${index}`}>
                                    <NavListButtonEdit
                                        text={event.title}
                                        path={event._id.$oid}
                                        from={location.pathname} />
                                </li>
                            )) :
                            <p className='text-sm flex gap-2 items-center w-full text-center'>
                                <IoWarningOutline size={24} color='#FF6B00' />
                                ایونتی وجود ندارد
                            </p>
                }
            </ul>
            <AddButton from={location.pathname} path={'create'} />
        </div>
    )
}

export default ManageEvents