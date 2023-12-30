import { useQuery } from "react-query"
import { getGodEvents } from '../../api/eventApi'
import { useSelector } from "react-redux"
import BgPic from '../../assets/james-bond-cover.jpg'
import EventCard from "../../components/events/eventCard"
import Circular from "../../components/ui/Circular"
import { IoWarningOutline } from "react-icons/io5"

const GodEvents = () => {
  const globalUser = useSelector(state => state.userReducer)

  const { data: godEvents, isLoading: godEventsIsLoading } =
    useQuery('god-events', () => getGodEvents(globalUser.accessToken), {
      refetchOnWindowFocus: false
    })


  const empty = []

  return (
    <div className="h-custom-screen overflow-auto flex flex-col items-center gap-6">
      <h2 className='text-xl w-full'>ایونت های من</h2>
      <div className=" h-full flex flex-col pl-1 gap-4 overflow-auto w-full items-center">
        {
          godEventsIsLoading ?
            <Circular /> :
            godEvents.data?.length ?
              godEvents.data.map(event => (
                <EventCard
                  name={event.title}
                  date={event.started_at}
                  god={event.group_info.owner}
                  BgPic={event.image_path ? event.image_path : BgPic}
                  path={`/mafia/events/${event._id.$oid}`}
                />
              )) :
              <p className='text-sm flex gap-2 items-center w-full text-center'>
                <IoWarningOutline size={24} color='#FF6B00' />
                ایونتی وجود ندارد
              </p>
        }
      </div>
    </div>
  )
}

export default GodEvents