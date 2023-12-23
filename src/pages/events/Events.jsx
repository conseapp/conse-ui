import React, { Fragment, useState } from 'react'
import { getEvents, getGodEvents } from '../../api/eventApi'
import { useQuery } from 'react-query';
import Circular from '../../components/ui/Circular';
import { IoWarningOutline } from 'react-icons/io5';
import EventCard from '../../components/events/eventCard';
import BgPic from '../../assets/james-bond-cover.jpg'


const Events = () => {
  const [events, setEvents] = useState([])

  const { data: fetchedEvents, isLoading: eventsIsLoading } =
    useQuery('events', getEvents, {
      onSuccess: (result) => {
        setEvents(result.data.reverse())
      },
      refetchOnWindowFocus: false
    })

  return (
    <div className="h-custom-screen overflow-auto flex flex-col items-center gap-6">
      {
        eventsIsLoading ?
          <Circular /> :
          events.length ? events.map((event, index) => (
            <Fragment key={`event-${index}`}>
              <EventCard
                name={event.title}
                date={event.started_at}
                god={event.group_info.owner}
                capacity={event.max_players}
                BgPic={event.image_path ? `https://panel.api.conse.app/${event.image_path}` : BgPic}
                path={`/mafia/events/${event._id.$oid}`}
              />
            </Fragment>
          )) :
            <p className='text-sm flex gap-2 items-center w-full text-center'>
              <IoWarningOutline size={24} color='#FF6B00' />
              ایونتی وجود ندارد
            </p>
      }

    </div>
  )
}

export default Events