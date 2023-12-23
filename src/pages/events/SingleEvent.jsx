import React, { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getGodGroups } from '../../api/gameApi'
import { getSingleEvent } from '../../api/eventApi'
// import BgPic from '../../assets/james-bond-cover.jpg'
import Circular from '../../components/ui/Circular'
import { DateObject } from 'react-multi-date-picker'
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import GodSingleEvent from '../../components/events/GodSingleEvent'
import PlayerSingleEvent from '../../components/events/PlayerSingleEvent'



const SingleEvent = (props) => {
    const globalUser = useSelector(state => state.userReducer)
    const { eventId } = useParams()
    const client = useQueryClient()
    const navigate = useNavigate()
    const location = useLocation()
    const [isOwner, setIsOwner] = useState(false)
    const [startTime, setStartTime] = useState(false)


    // const handlers = useSwipeable({
    //     onSwipedUp: () => {
    //         setHeight(530)
    //         setTimeout(() => {
    //             setIsOpen(true)
    //         }, 100);
    //     },
    //     onSwipedDown: () => {
    //         setHeight(360)
    //         setIsOpen(false)
    //     },
    //     // swipeDuration: 500,
    //     // preventScrollOnSwipe: true,
    //     trackMouse: true
    // });

    const { data: groups, isLoading: groupIsLoading } = useQuery('groups', () => {
        if (globalUser.accessLevel === 0 || globalUser.accessLevel === 1) {
            return getGodGroups(globalUser.accessToken, globalUser.id)
        } else {
            return Promise.resolve([])
        }
    }, {
        refetchOnWindowFocus: false
    })

    const { data: singleEvent, isLoading: singleEventIsLoading, isFetching: singleEventIsFetching } = useQuery([`single-event-${eventId}`], () => {
        const body = { _id: eventId }
        const reqInfo = { token: globalUser.accessToken, body: body }

        return getSingleEvent(reqInfo)
    }, {
        onSuccess: (result) => {
            setStartTime(
                new DateObject({
                    date: result.data.started_at * 1000,
                    calendar: persian,
                    locale: persian_fa,
                })
            )
            if (result.data.group_info.god_id === globalUser.id)
                setIsOwner(true)
        },
        refetchOnWindowFocus: false
    })


    return (
        <div className='h-custom-screen mx-[-16px]'>
            {
                singleEventIsFetching ?
                    <div className='flex flex-col h-custom-screen justify-center'>
                        <Circular />
                    </div> :
                    isOwner ?
                        <GodSingleEvent singleEvent={singleEvent.data} startTime={startTime} />
                        : <PlayerSingleEvent singleEvent={singleEvent.data} startTime={startTime}/>
            }

        </div >
    )
}

export default SingleEvent