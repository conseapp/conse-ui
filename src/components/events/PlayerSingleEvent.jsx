import { useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { RegularButton, OutlineButton, CancelButton } from "../../components/ui/buttons";
import { useSelector } from 'react-redux';
import { getPlayerExpiredEvents, getPlayerIngoingEvents, reserveEvent } from '../../api/eventApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import BgPic from '../../assets/james-bond-cover.jpg'




const PlayerSingleEvent = ({ singleEvent, startTime }) => {
    const [IsUserRegistered, SetUserRegistered] = useState(false)
    const [TodayIsEventDay, SetTodayIsEventDay] = useState(false)
    const globalUser = useSelector(state => state.userReducer)
    const location = useLocation()
    const client = useQueryClient()

    const { data: playerEvents, isLoading: playerEventsIsLoading , isRefetching} =
        useQuery('player-events', () => {
            if (singleEvent.is_expired)
                return getPlayerExpiredEvents(globalUser.accessToken)
            else return getPlayerIngoingEvents(globalUser.accessToken)
        }, {
            refetchOnWindowFocus: false
        })


    const { mutate: reserveEventMutation } = useMutation(reserveEvent,
        {
            onSuccess: (result) => {
                toast.success('شما با موفقیت در ایونت ثبت نام کردید')
                // navigate('details', { state: { from: location.pathname, backButton: true, } })
                client.invalidateQueries(['player-events'])
            },
            onError: (error) => {
                toast.error('خطایی در هنگام شرکت در ایونت پیش آمده')
            },
        })


    useEffect(() => {
        // Checking whether the current event exists in the user's event list or not
        if (playerEvents) {
            const list = playerEvents.data.filter(event => event._id.$oid === singleEvent._id.$oid)
            SetUserRegistered(list.length !== 0)
        }
    }, [playerEvents?.data])


    useEffect(() => {
        let event = new Date(singleEvent.started_at * 1000)
        let current = new Date()

        let e_date = `${event.getFullYear()}/${event.getMonth()}/${event.getDay()}`,
            c_date = `${current.getFullYear()}/${current.getMonth()}/${current.getDay()}`

        SetTodayIsEventDay(e_date === c_date)
    }, [singleEvent.started_at])


    const reserveEventHandle = () => {
        const body = {
            event_id: singleEvent._id.$oid,
            requested_at: Math.floor(Date.now() / 1000)
        }
        const reqInfo = { token: globalUser.accessToken, body }
        reserveEventMutation(reqInfo)
    }

    return (
        <div className='flex flex-col items-center gap-2 justify-end h-full'>
            {
                (IsUserRegistered && TodayIsEventDay && !singleEvent.is_expired) ?
                    <div className="w-full h-full overflow-auto flex flex-col items-center gap-6">
                        <h2 className='text-xl w-full px-4'>در حال انجام</h2>
                        <div style={{ backgroundImage: `url(${BgPic})` }} className=' shrink-0 relative w-full h-[200px] bg-cover bg-no-repeat bg-center'>
                            <div className="absolute w-full h-full left-0 top-0 bg-gradient-to-b from-transparent from-40% to-[#361849] to-100%"></div>
                        </div>
                        <div className='w-full p-4 relative bottom-6 flex flex-col gap-10'>
                            <div className='w-full flex flex-col gap-2'>
                                <h2 className='text-xl w-full px-4 text-center'>اطلاعات ایونت</h2>
                                <div className='flex flex-col bg-navy items-center px-4 py-6  gap-6 rounded-2xl'>
                                    <div className='flex flex-col items-center gap-2 justify-center'>
                                        <h2 className='w-full text-center text-xl'>{singleEvent.title}</h2>
                                        <span className="text-sm">{`${startTime.format("D MMMM")} - ساعت ${startTime.format("HH:mm")}`}</span>
                                    </div>
                                    <div className='w-full flex flex-col items-center px-2 gap-2'>
                                        <div className='flex flex-col w-full gap-1'>
                                            <span className='text-gray-light text-sm'>گرداننده</span>
                                            <span>{singleEvent.group_info.owner}</span>
                                        </div>
                                        <div className='flex flex-col w-full gap-1'>
                                            <span className='text-gray-light text-sm'>نام گروه</span>
                                            <span>{singleEvent.group_info.name}</span>
                                        </div>
                                        <div className='flex flex-col w-full gap-1'>
                                            <span className='text-gray-light text-sm'>سناریو</span>
                                            <span>{singleEvent.content}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col gap-6'>
                                <h2 className='text-xl w-full px-4 text-center'>نقش شما</h2>
                                {
                                    (true) &&
                                    <p className='border border-secondary text-sm shadow-neon-blue-sm rounded-2xl px-4 py-3'>هنوز نقشی به شما تعلق نگرفته است.</p>
                                }
                            </div>
                            <div className='w-full flex flex-col gap-6 pt-6'>
                                <h2 className='text-xl w-full px-4 text-center'>نقش های موجود در ایونت</h2>
                                <div className='flex flex-col gap-4'>
                                    <h3>نقش های شهروند</h3>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='col-span-1 flex flex-col justify-end p-3 aspect-square bg-gray-dark rounded-2xl'>
                                            <span className='text-sm'>نام کارت بازی</span>
                                        </div>
                                        <div className='col-span-1 flex flex-col justify-end p-3 aspect-square bg-gray-dark rounded-2xl'>
                                            <span className='text-sm'>نام کارت بازی</span>
                                        </div>
                                        <div className='col-span-1 flex flex-col justify-end p-3 aspect-square bg-gray-dark rounded-2xl'>
                                            <span className='text-sm'>نام کارت بازی</span>
                                        </div>
                                        <div className='col-span-1 flex flex-col justify-end p-3 aspect-square bg-gray-dark rounded-2xl'>
                                            <span className='text-sm'>نام کارت بازی</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='pb-[280px]'>
                        <div style={{ backgroundImage: `url(${BgPic})` }} className='w-full aspect-4/3 bg-cover absolute top-0 left-0 -z-10 bg-no-repeat bg-center'>
                            <div className="absolute w-full h-full left-0 top-0 bg-gradient-to-b from-transparent from-40% to-[#361849] to-100%"></div>
                        </div>
                        <div className='flex flex-col items-center gap-2 justify-end h-full' >
                            <div className='flex flex-col items-center gap-2 h-40 justify-center'>
                                <h2 className='w-full text-center text-xl'>{singleEvent.title}</h2>
                                <span className="text-sm">{`${startTime.format("D MMMM")} - ساعت ${startTime.format("HH:mm")}`}</span>
                            </div>
                            <div className='h-[360px] pb-20 transition-all flex flex-col items-center rounded-t-xl p-4 absolute bg-navy w-full bottom-0 left-0 z-10'            >
                                <div className='relative bg-gray w-10 h-1 rounded-lg shrink-0'></div>
                                <div className='flex flex-col justify-between w-full h-full'>
                                    <div className='w-full flex flex-col items-center py-4 px-2  gap-2'>
                                        <div className='flex flex-col w-full gap-1'>
                                            <span className='text-gray-light text-sm'>گرداننده</span>
                                            <span>{singleEvent.group_info.owner}</span>
                                        </div>
                                        <div className='flex flex-col w-full gap-1'>
                                            <span className='text-gray-light text-sm'>نام گروه</span>
                                            <span>{singleEvent.group_info.name}</span>
                                        </div>
                                        <div className='flex flex-col w-full gap-1'>
                                            <span className='text-gray-light text-sm'>سناریو</span>
                                            <span>{singleEvent.content}</span>
                                        </div>
                                    </div>
                                    <div className='w-full flex flex-col items-center py-4 px-2 gap-4'>
                                        {
                                            (!singleEvent.is_expired && !singleEvent.is_locked && !IsUserRegistered && globalUser.accessLevel == 2) &&
                                            <RegularButton onClick={reserveEventHandle} text='شزکت در ایونت' />
                                        }
                                        {
                                            (IsUserRegistered && !TodayIsEventDay && !singleEvent.is_expired && !singleEvent.is_locked) &&
                                            <p className='border border-secondary text-sm shadow-neon-blue-sm rounded-2xl px-4 py-3'>ایونت هنوز شروع نشده است.</p>
                                        }
                                        {
                                            (!singleEvent.is_expired && singleEvent.is_locked) &&
                                            <p className='border border-secondary text-sm shadow-neon-blue-sm rounded-2xl px-4 py-3'>این ایونت بسته شده است.</p>
                                        }
                                        {
                                            (singleEvent.is_expired) &&
                                            // <RegularButton onClick={() => { }} text='شزکت در ایونت' />
                                            <p className='border border-secondary text-sm shadow-neon-blue-sm rounded-2xl px-4 py-3'>این ایونت به پایان رسیده است.</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default PlayerSingleEvent