import { Fragment, useState } from 'react'
import { getPlayerExpiredEvents, getPlayerIngoingEvents } from '../api/eventApi';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import EventCard from '../components/events/EventCard';
import { IoWarningOutline } from 'react-icons/io5';
import BgPic from '../assets/james-bond-cover.jpg'
import Circular from '../components/ui/Circular';


const PlayerEvents = () => {
    const globalUser = useSelector(state => state.userReducer)

    const { data: PlayerIngoingEvents, isLoading: PlayerIngoingEventsIsLoading } =
        useQuery('player-ingoing-events', () => getPlayerIngoingEvents(globalUser.accessToken), {
            refetchOnWindowFocus: true,
            refetchInterval: 5000
        })

    const { data: playerExpiredEvents, isLoading: playerExpiredEventsIsLoading } =
        useQuery('player-expired-events', () => getPlayerExpiredEvents(globalUser.accessToken), {
            refetchOnWindowFocus: true,
            refetchInterval: 5000
        })


    const [activeTab, setActiveTab] = useState('forthcoming')
    const normalClassname = 'flex-1 cursor-pointer text-center pt-2 pb-3 text-[#AEAEAE] flex flex-col gap-2 items-center after:content-[""] after:rounded-2xl after:bg-secondary after:drop-shadow-neon-blue-sm after:w-0 after:block after:h-[2px]'
    const activeClassname = 'transition-colors cursor-pointer after:transition-width flex-1 text-center pt-2 pb-3 flex flex-col gap-2 items-center after:content-[""] after:rounded-2xl after:bg-secondary after:drop-shadow-neon-blue-sm after:w-full after:block after:h-[2px]'
    return (
        <div className='h-custom-screen flex flex-col'>
            <div className='w-full flex pt-3'>
                <span onClick={() => setActiveTab('forthcoming')} className={activeTab == 'forthcoming' ? activeClassname : normalClassname}>پیش‌رو</span>
                <span onClick={() => setActiveTab('in-going')} className={activeTab == 'in-going' ? activeClassname : normalClassname}>درحال انجام</span>
                <span onClick={() => setActiveTab('expired')} className={activeTab == 'expired' ? activeClassname : normalClassname}>پایان یافته</span>
            </div>
            <div className="w-full h-full pt-4 overflow-auto flex flex-col items-center gap-6">
                {
                    activeTab == 'forthcoming' ?
                        PlayerIngoingEventsIsLoading ?
                            <Circular /> :
                            PlayerIngoingEvents?.data.filter(event => !event.is_locked).length ? PlayerIngoingEvents?.data.map((event, index) => (
                                <Fragment key={`event-${index}`}>
                                    <EventCard
                                        name={event.title}
                                        date={event.started_at}
                                        god={event.group_info.owner}
                                        capacity={event.max_players}
                                        BgPic={event.image_path ? `https://panel.api.jamshid.app/${event.image_path}` : BgPic}
                                        path={`/mafia/events/${event._id.$oid}`}
                                    />
                                </Fragment>
                            )) :
                                <p className='text-sm flex gap-2 items-center w-full text-center'>
                                    <IoWarningOutline size={24} color='#FF6B00' />
                                    ایونتی وجود ندارد
                                </p>
                        : <></>
                }
                {
                    activeTab == 'in-going' ?
                        PlayerIngoingEventsIsLoading ?
                            <Circular /> :
                            PlayerIngoingEvents?.data.filter(event => event.is_locked).length ? PlayerIngoingEvents?.data.map((event, index) => (
                                <Fragment key={`event-${index}`}>
                                    <EventCard
                                        name={event.title}
                                        date={event.started_at}
                                        god={event.group_info.owner}
                                        capacity={event.max_players}
                                        BgPic={event.image_path ? `https://panel.api.jamshid.app/${event.image_path}` : BgPic}
                                        path={`/mafia/events/${event._id.$oid}`}
                                    />
                                </Fragment>
                            )) :
                                <p className='text-sm flex gap-2 items-center w-full text-center'>
                                    <IoWarningOutline size={24} color='#FF6B00' />
                                    ایونتی وجود ندارد
                                </p>
                        : <></>
                }
                {
                    activeTab == 'expired' ?
                        playerExpiredEventsIsLoading ?
                            <Circular /> :
                            playerExpiredEvents?.data.length ? playerExpiredEvents?.data.map((event, index) => (
                                <Fragment key={`event-${index}`}>
                                    <EventCard
                                        name={event.title}
                                        date={event.started_at}
                                        god={event.group_info.owner}
                                        capacity={event.max_players}
                                        BgPic={event.image_path ? `https://panel.api.jamshid.app/${event.image_path}` : BgPic}
                                        path={`/mafia/events/${event._id.$oid}`}
                                    />
                                </Fragment>
                            )) :
                                <p className='text-sm flex gap-2 items-center w-full text-center'>
                                    <IoWarningOutline size={24} color='#FF6B00' />
                                    ایونتی وجود ندارد
                                </p>
                        : <></>
                }

            </div>

        </div>
    )
}

export default PlayerEvents