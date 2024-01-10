import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { addPhase, getSingleGodEvent } from '../../api/eventApi'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import BgPic from '../../assets/james-bond-cover.jpg'
import { DateObject } from 'react-multi-date-picker'
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { FaAngleDown } from 'react-icons/fa6'
import { resetPhaseState, updateTime } from '../../redux/actions'
import { RegularButton } from '../../components/ui/buttons'
import { toast } from 'react-toastify'

const History = () => {
    const dispatch = useDispatch()
    const globalUser = useSelector(state => state.userReducer)
    const { selectedTime } = useSelector(state => state.timeReducer)
    const phase = useSelector(state => state.phaseReducer)
    const { eventId } = useParams()
    const client = useQueryClient()
    const [bgImage, setBgImage] = useState('')
    const [startTime, setStartTime] = useState(false)
    const [time, setTime] = useState('day')
    const [activeTab, setActiveTab] = useState([])
    const normalClassname = 'flex-1 cursor-pointer text-center pb-3 text-[#AEAEAE] flex flex-col gap-2 items-center after:content-[""] after:rounded-2xl after:bg-secondary after:drop-shadow-neon-blue-sm after:w-0 after:block after:h-[2px]'
    const activeClassname = 'transition-colors cursor-pointer after:transition-width flex-1 text-center pb-3 flex flex-col gap-2 items-center after:content-[""] after:rounded-2xl after:bg-secondary after:drop-shadow-neon-blue-sm after:w-full after:block after:h-[2px]'


    const { data: godEvent, isLoading: godEventIsLoading, isFetching: godEventIsFetching } = useQuery([`god-event-${eventId}`], () => {
        const reqInfo = { token: globalUser.accessToken, eventId: eventId }

        return getSingleGodEvent(reqInfo)
    }, {
        onSuccess: (result) => {
            setStartTime(
                new DateObject({
                    date: result.data.started_at * 1000,
                    calendar: persian,
                    locale: persian_fa,
                })
            )
            // if (result.data.group_info.god_id === globalUser.id)
            // setPlayers(result.data.players)
        },
        refetchOnWindowFocus: false
    })

    const { mutate: addPhaseMutation } = useMutation(addPhase,
        {
            onSuccess: (result) => {
                toast.success('فاز قبل با موفقیت ذخیره شد')
                dispatch(resetPhaseState());
                dispatch(updateTime('day'))
                client.invalidateQueries([`god-event-${eventId}`])

            },
            onError: (error) => {
                toast.error('فاز قبل با موفقیت ذخیره شد')
            },
        })


    useEffect(() => {
        !!godEvent?.data.image_path ? setBgImage(`https://panel.api.jamshid.app/${godEvent?.data.image_path}`) : setBgImage(BgPic)


    }, [godEvent?.data.image_path])

    useEffect(() => {
        if (selectedTime) {
            setTime(selectedTime)
        }
    }, [selectedTime])

    useEffect(() => {
        godEvent?.data.phases.map((phase, index) => {
            setActiveTab(prev => ({ ...prev, [index]: 'day' }))
        })
    }, [godEvent?.data.phases])

    const handleTime = (time) => {
        dispatch(updateTime(time))
    }

    const nextPhase = async () => {
        const { day, mid_day, night } = phase
        const body = {
            event_id: godEvent?.data._id.$oid,
            phase: {
                day: day,
                mid_day: mid_day,
                night: night
            }
        }

        const reqInfo = { token: globalUser.accessToken, body }
        addPhaseMutation(reqInfo)
    }

    return (
        <div className='h-custom-screen mx-[-16px]'>
            <div className="w-full h-full overflow-auto flex flex-col items-center gap-2 pb-4">
                <h2 className='text-xl w-full px-4'>تاریخچه‌ی بازی</h2>
                <div style={{ backgroundImage: `url(${bgImage})` }} className='flex flex-col justify-end p-4 shrink-0 relative w-full h-[200px] bg-cover bg-no-repeat bg-center'>
                    <div className="absolute w-full h-full left-0 top-0 bg-gradient-to-b from-transparent from-40% to-[#361849] to-100%"></div>
                    <div className='flex flex-col gap-2 z-10'>
                        <h3 className='text-lg'>{godEvent?.data.title}</h3>
                        {
                            startTime ?
                                <span className="text-sm">{`${startTime.format("D MMMM")} - ساعت ${startTime.format("HH:mm")}`}</span>
                                : <></>
                        }
                    </div>
                </div>
                <div className='w-full p-4 relative mt-4 bottom-6 flex flex-col gap-6'>
                    {
                        godEvent?.data.phases.map((singlePhase, index) => {
                            return (
                                <Accordion
                                    sx={{ width: '100%', bgcolor: '#0D0D1F', color: 'white', overflow: 'hidden' }}
                                    style={{ borderRadius: '16px' }}
                                >
                                    <AccordionSummary
                                        expandIcon={<FaAngleDown color='white' />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <h3 className='text-lg'>فاز {index + 1}</h3>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ paddingTop: '0' }}>
                                        <div className='w-full flex'>
                                            <span onClick={() => setActiveTab(prev => ({ ...prev, [index]: 'day' }))} className={activeTab[index] == 'day' ? activeClassname : normalClassname}>روز</span>
                                            <span onClick={() => setActiveTab(prev => ({ ...prev, [index]: 'mid_day' }))} className={activeTab[index] == 'mid_day' ? activeClassname : normalClassname}>رای‌گیری روز</span>
                                            <span onClick={() => setActiveTab(prev => ({ ...prev, [index]: 'night' }))} className={activeTab[index] == 'night' ? activeClassname : normalClassname}>شب</span>
                                        </div>
                                        <div className='flex flex-col gap-4 w-full'>
                                            {
                                                singlePhase[activeTab[index]]?.length ?
                                                    singlePhase[activeTab[index]]?.map((user, index) => {
                                                        const { username, role_name, chain_history } = user
                                                        return (
                                                            <div className='flex flex-col w-full gap-2'>
                                                                <div className='flex w-full justify-start gap-2'>
                                                                    <span className=''>نام کاربری:</span>
                                                                    <span className=''>{username}</span>
                                                                </div>
                                                                <div className='flex w-full justify-start gap-2'>
                                                                    <span className=''>نقش:</span>
                                                                    <span className=''>{role_name}</span>
                                                                </div>
                                                                <div className='flex flex-col'>
                                                                    <span>اطلاعات چین:</span>
                                                                    {
                                                                        chain_history.map((chainInfo, index) => (
                                                                            <div className='flex flex-col px-4 gap-1 pt-1'>
                                                                                <div className='flex w-full justify-start gap-2'>
                                                                                    <span className=''>به آیدی:</span>
                                                                                    <span className=''>{chainInfo.to_id}</span>
                                                                                </div>
                                                                                <div className='flex w-full justify-start gap-2'>
                                                                                    <span className=''>ساعت:</span>
                                                                                    <span className=''>{new DateObject(chainInfo.chained_at * 1000).format('HH:mm:ss')}</span>
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                                <hr />
                                                            </div>
                                                        )
                                                    })
                                                    : <></>
                                            }

                                        </div>
                                    </AccordionDetails>
                                </Accordion >
                            )
                        })
                    }

                    <Accordion
                        sx={{ width: '100%', bgcolor: '#0D0D1F', color: 'white', overflow: 'hidden' }}
                        style={{ borderRadius: '16px' }}
                    >
                        <AccordionSummary
                            expandIcon={<FaAngleDown color='white' />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <h3 className='text-lg'>فاز {godEvent?.data.phases.length + 1}</h3>
                        </AccordionSummary>
                        <AccordionDetails sx={{ paddingTop: '0' }}>
                            <div className='w-full flex'>
                                <span onClick={() => handleTime('day')} className={time == 'day' ? activeClassname : normalClassname}>روز</span>
                                <span onClick={() => handleTime('mid_day')} className={time == 'mid_day' ? activeClassname : normalClassname}>رای‌گیری روز</span>
                                <span onClick={() => handleTime('night')} className={time == 'night' ? activeClassname : normalClassname}>شب</span>
                            </div>
                            <div className='flex flex-col gap-4 w-full'>
                                {
                                    phase[time].length ?
                                        phase[time].map((user, index) => {
                                            const { username, role_name, chain_history } = user
                                            return (
                                                <div className='flex flex-col w-full gap-2'>
                                                    <div className='flex w-full justify-start gap-2'>
                                                        <span className=''>نام کاربری:</span>
                                                        <span className=''>{username}</span>
                                                    </div>
                                                    <div className='flex w-full justify-start gap-2'>
                                                        <span className=''>نقش:</span>
                                                        <span className=''>{role_name}</span>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span>اطلاعات چین:</span>
                                                        {
                                                            chain_history.map((chainInfo, index) => (
                                                                <div className='flex flex-col px-4 gap-1 pt-1'>
                                                                    <div className='flex w-full justify-start gap-2'>
                                                                        <span className=''>به آیدی:</span>
                                                                        <span className=''>{chainInfo.to_id}</span>
                                                                    </div>
                                                                    <div className='flex w-full justify-start gap-2'>
                                                                        <span className=''>ساعت:</span>
                                                                        <span className=''>{new DateObject(chainInfo.chained_at * 1000).format('HH:mm:ss')}</span>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                    <hr />
                                                </div>
                                            )
                                        })
                                        : <></>
                                }

                            </div>
                        </AccordionDetails>
                    </Accordion >

                </div>
            </div>
            <div className='flex-1 flex items-end w-full px-4 relative bottom-6'>
                <RegularButton text={'فاز بعد'} onClick={nextPhase} />
            </div>
        </div>
    )
}

export default History