import React, { Fragment, useEffect, useState } from 'react'
import { getEvents, getGodEvents, search } from '../../api/eventApi'
import { useQuery } from 'react-query';
import Circular from '../../components/ui/Circular';
import { IoWarningOutline } from 'react-icons/io5';
import EventCard from '../../components/events/EventCard';
import BgPic from '../../assets/james-bond-cover.jpg'
import EventCardCol from '../../components/events/EventCardCol';
import { SearchInput } from '../../components/ui/inputs';


const Events = () => {
  const [events, setEvents] = useState([])
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState({});


  const { data: fetchedEvents, isLoading: eventsIsLoading } =
    useQuery('events', getEvents, {
      onSuccess: (result) => {
        setEvents(result.data.reverse())
      },
      refetchOnWindowFocus: false
    })

  const Search = async e => {
    if (Boolean(query)) {
      let response = await search(query)
      setEvents(response.data.reverse())
    } else if (!!fetchedEvents?.data)
      setEvents(fetchedEvents?.data)

  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Search()
    }, 500);

    return () => {
      clearTimeout(timeoutId)
    }
  }, [query])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);



  return (
    <div className='h-custom-screen flex flex-col gap-4 pt-2'>
      <SearchInput id='title' value={query} placeholder={'جستجو'} onChange={(e) => setQuery(e.target.value)} />

      <div className="h-full overflow-auto flex flex-col items-center">
        <div className='flex flex-wrap gap-y-6 justify-between w-full max-w-2xl'>
          {
            eventsIsLoading ?
              <Circular /> :
              events?.length ? events?.map((event, index) => (
                <Fragment key={`event-${index}`}>
                  {
                    (index % 3 === 0) ?
                      <EventCard
                        name={event.title}
                        date={event.started_at}
                        god={event.group_info.owner}
                        capacity={event.max_players}
                        BgPic={event.image_path ? `https://panel.api.jamshid.app/${event.image_path}` : BgPic}
                        path={`/mafia/events/${event._id.$oid}`}
                      /> :
                      <EventCardCol
                        name={event.title}
                        date={event.started_at}
                        god={event.group_info.owner}
                        capacity={event.max_players}
                        BgPic={event.image_path ? `https://panel.api.jamshid.app/${event.image_path}` : BgPic}
                        path={`/mafia/events/${event._id.$oid}`}
                      />
                  }

                </Fragment>
              )) :
                <p className='text-sm flex gap-2 items-center w-full text-center'>
                  <IoWarningOutline size={24} color='#FF6B00' />
                  ایونتی وجود ندارد
                </p>
          }
        </div>

      </div>
    </div>
  )
}

export default Events