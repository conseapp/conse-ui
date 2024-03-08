import { useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { RegularButton, OutlineButton, CancelButton } from "../../components/ui/buttons";
import { useSelector } from 'react-redux';
import { getPlayerExpiredEvents, getPlayerIngoingEvents, reserveEvent } from '../../api/eventApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import BgPic from '../../assets/james-bond-cover.jpg'
import { getRoles, getSides, getSingleDeck, getSinglePlayer } from '../../api/gameApi';
import Avatar from '../ui/Avatar';
import LearningCard from '../learning/LearningCard';
import { getUserBalance, paymentRequest, purchaseEvent } from '../../api/walletApi';
import { Modal } from '@mui/material';
import CancelEventModal from './CancelEventModal.';



const PlayerSingleEvent = ({ singleEvent, startTime }) => {
    const [IsUserRegistered, SetUserRegistered] = useState(false)
    const [TodayIsEventDay, SetTodayIsEventDay] = useState(false)
    const [hoursToEvent, SetHoursToEvent] = useState(0)
    const globalUser = useSelector(state => state.userReducer)
    const [bgImage, setBgImage] = useState('')
    const client = useQueryClient()
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [paymentbuttonDisabled, setPaymentButtonDisabled] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openCancelEventModal, setOpenCancelEventModal] = useState(false)
    const [paymentOption, setPaymentOption] = useState('wallet')

    useEffect(() => {
        !!singleEvent.image_path ? setBgImage(`https://panel.api.jamshid.app/${singleEvent.image_path}`) : setBgImage(BgPic)


    }, [singleEvent.image_path])

    const StatusText = number => {
        if (number === 0) return ('شما در حال بازی هستید')
        if (number === 1) return ('شما از بازی اخراج شدید')
        if (number === 2) return ('شما از بازی خارج شدید')
        if (number === 3) return ('تمام توانایی های شما برای 3 شب گرفته شده')
        if (number === 4) return ('تمام توانایی های شما برای همیشه گرفته شده')
        if (number === 5) return ('به مدت 2 شب سایلنت هستید')
        if (number === 6) return ('به مدت 6 شب سایلنت هستید')
        if (number === 7) return ('به یک بازیکن متصل شدید')
        if (number === 8) return ('نقش شما تغییر کرده')
        if (number === 9) return ('ساید شما تغییر کرده')
        if (number === 10) return ('از بازی خارج شده اید')
        if (number === 11) return ('شما خدا رو فدا کرده اید')
        if (number === 12) return ('قاتل حرفه ای به دنبال شماست')
    }

    const { data: playerEvents, isLoading: playerEventsIsLoading, isRefetching } =
        useQuery('player-events', () => {
            if (singleEvent.is_expired)
                return getPlayerExpiredEvents(globalUser.accessToken)
            else return getPlayerIngoingEvents(globalUser.accessToken)
        }, {
            refetchOnWindowFocus: true,
            refetchInterval: 5000
        })

    const { data: singlePlayer, isLoading: singlePlayerIsLoading, isFetching: singlePlayerIsFetching } = useQuery([`single-player-${globalUser.id}`], () => {
        const reqInfo = {
            token: globalUser.accessToken, body: {
                event_id: singleEvent._id.$oid,
                user_id: globalUser.id
            }
        }

        return getSinglePlayer(reqInfo)
    }, {
        refetchOnWindowFocus: true,
        refetchInterval: 5000
    })

    const { data: singleDeck, isLoading: singleDeckIsLoading, isFetching: singleDeckIsFetching } =
        useQuery([`single-deck-${singleEvent?.deck_id}`], () => {
            if (singleEvent?.deck_id !== null) {
                const reqInfo = { token: globalUser.accessToken, body: { _id: singleEvent?.deck_id } }

                return getSingleDeck(reqInfo)
            }
        }, {
            refetchOnWindowFocus: true,
            refetchInterval: 10000
        })

    const { data: userBalance, isLoading: userBalanceLoading } =
        useQuery('user-balance', () => getUserBalance({ token: globalUser.accessToken, userID: globalUser.id }), {
            refetchOnWindowFocus: false
        })


    const { mutate: reserveEventMutation } = useMutation(reserveEvent,
        {
            onSuccess: (result) => {
                toast.success('شما با موفقیت در ایونت ثبت نام کردید')
                client.invalidateQueries(['player-events'])
                setButtonDisabled(false)
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

    useEffect(() => {
        let current = Math.floor(new Date().getTime() / 1000)
        let timeRemaining = (singleEvent.started_at - current) / 3600

        SetHoursToEvent(timeRemaining)
    }, [singleEvent.started_at])



    const reserveEventHandle = () => {
        const body = {
            event_id: singleEvent._id.$oid,
            requested_at: Math.floor(Date.now() / 1000)
        }
        const reqInfo = { token: globalUser.accessToken, body }
        reserveEventMutation(reqInfo)
    }

    const { mutate: purchaseMutation } =
        useMutation(purchaseEvent,
            {
                onSuccess: (result) => {
                    console.log(result)
                    reserveEventHandle()
                    client.invalidateQueries('user-balance')
                    setOpenModal(false)
                    setPaymentButtonDisabled(false)
                },
                onError: (error) => {
                    toast.error('خطایی در هنگام شرکت در ایونت پیش آمده')
                    setPaymentButtonDisabled(false)
                },
            })

    const { mutate: depositMutation } =
        useMutation(paymentRequest,
            {
                onSuccess: (result) => {
                    window.location.replace(result.url)
                },
                onError: (error) => {
                    toast.error('خطایی در هنگام شرکت در ایونت پیش آمده')
                    setPaymentButtonDisabled(false)
                },
            })

    const handlePurchase = () => {
        setPaymentButtonDisabled(true)

        if (paymentOption === 'wallet') {
            const reqInfo = {
                token: globalUser.accessToken,
                userID: globalUser.id,
                amount: singleEvent.entry_price,
                eventID: singleEvent._id.$oid
            }
            purchaseMutation(reqInfo)
        }
        if (paymentOption === 'online') {
            const reqInfo = {
                token: globalUser.accessToken,
                userID: globalUser.id,
                eventID: singleEvent._id.$oid,
                amount: singleEvent.entry_price,
                phone: globalUser.phone,
                type: 'purchase',
            }
            depositMutation(reqInfo)
        }
    }


    return (
        <div className='flex flex-col items-center gap-2 justify-end h-full'>
            {
                (IsUserRegistered && TodayIsEventDay && !singleEvent.is_expired) ?
                    <div className="w-full h-full overflow-auto flex flex-col items-center gap-6">
                        <h2 className='text-xl w-full px-4'>در حال انجام</h2>
                        <div style={{ backgroundImage: `url(${bgImage})` }} className=' shrink-0 relative w-full h-[200px] bg-cover bg-no-repeat bg-center'>
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
                                        <div className='w-full flex justify-between'>
                                            <div className='flex flex-col gap-1'>
                                                <span className='text-gray-light text-sm'>گرداننده</span>
                                                <span>{singleEvent.group_info.owner}</span>
                                            </div>
                                            {
                                                hoursToEvent >= 0 ?
                                                    <div>
                                                        <CancelButton onClick={() => setOpenCancelEventModal(true)} text='لغو ایونت' />
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                        <div className='flex flex-col w-full gap-1'>
                                            <span className='text-gray-light text-sm'>نام گروه</span>
                                            <span>{singleEvent.group_info.name}</span>
                                        </div>
                                        <div className='flex flex-col w-full gap-1'>
                                            <span className='text-gray-light text-sm'>سناریو</span>
                                            <div dangerouslySetInnerHTML={{ __html: singleEvent.content }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col gap-6'>
                                <h2 className='text-xl w-full px-4 text-center'>نقش شما</h2>
                                {
                                    // console.log(singlePlayer.data?.role_id.$oid)
                                    (singlePlayer && singlePlayer.data.role_name && playerEvents.data.filter(event => event._id.$oid === singleEvent._id.$oid)[0]?.is_locked) ?
                                        <div className='w-full flex bg-navy p-2 pl-3.5 rounded-3xl items-center'>
                                            <Avatar color='blue' />
                                            <div className="h-full flex-1 flex flex-col justify-center px-4">
                                                <span>{singlePlayer.data.role_name}</span>
                                                <span className="text-sm">وضعیت: {StatusText(singlePlayer.data.status)}</span>
                                            </div>
                                        </div>
                                        :
                                        <p className='border border-secondary text-sm shadow-neon-blue-sm rounded-2xl px-4 py-3'>هنوز نقشی به شما تعلق نگرفته است.</p>
                                }
                            </div>
                            {
                                singleDeck?.data.roles.length ?
                                    <div className='w-full flex flex-col gap-6 pt-6'>
                                        <h2 className='text-xl w-full px-4 text-center'>نقش های موجود در ایونت</h2>
                                        {
                                            <div className='grid grid-cols-2 gap-4'>
                                                {
                                                    singleDeck?.data.roles.map(role => {
                                                        role = { ...role, _id: { $oid: role._id } }
                                                        return (
                                                            <div className='col-span-1 flex flex-col aspect-square overflow-hidden bg-gray-dark rounded-2xl' >
                                                                <LearningCard card={role} type={singleEvent?.title.includes('cp/') ? 'classic-role' : 'modern-role'} />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        }
                                    </div> : <></>
                            }
                        </div>
                    </div>
                    :
                    <div className='pb-[280px]'>
                        <div style={{ backgroundImage: `url(${bgImage})` }} className='w-full aspect-4/3 bg-cover absolute top-0 left-0 -z-10 bg-no-repeat bg-center'>
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
                                        <div className='flex justify-between w-full'>
                                            <div className='flex flex-col gap-1'>
                                                <span className='text-gray-light text-sm'>گرداننده</span>
                                                <span>{singleEvent.group_info.owner}</span>
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <span className='text-gray-light text-sm'>قیمت</span>
                                                <span>{Number(singleEvent.entry_price).toLocaleString()} تومان</span>
                                            </div>
                                        </div>
                                        <div className='w-full flex justify-between'>
                                            <div className='flex-col'>
                                                <div className='flex flex-col w-full gap-1'>
                                                    <span className='text-gray-light text-sm'>نام گروه</span>
                                                    <span>{singleEvent.group_info.name}</span>
                                                </div>
                                                <div className='flex flex-col w-full gap-1'>
                                                    <span className='text-gray-light text-sm'>سناریو</span>
                                                    <div dangerouslySetInnerHTML={{ __html: singleEvent.content }}></div>
                                                </div>
                                            </div>
                                            {
                                                (IsUserRegistered && !TodayIsEventDay && !singleEvent.is_expired && !singleEvent.is_locked) &&
                                                <div className='pt-3'>
                                                    <CancelButton onClick={() => setOpenCancelEventModal(true)} text='لغو ایونت' />
                                                </div>
                                            }

                                        </div>
                                    </div>
                                    <div className='w-full flex flex-col items-center py-4 px-2 gap-4'>
                                        {
                                            (!singleEvent.is_expired && !singleEvent.is_locked && !IsUserRegistered && globalUser.accessLevel == 2) &&
                                            <RegularButton onClick={() => setOpenModal(true)} text='شرکت در ایونت' disabled={buttonDisabled} />
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
                                            // <RegularButton onClick={() => { }} text='شرکت در ایونت' />
                                            <p className='border border-secondary text-sm shadow-neon-blue-sm rounded-2xl px-4 py-3'>این ایونت به پایان رسیده است.</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            sx={{ backdropFilter: "blur(8px)", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <form className="min-w-[312px] max-w-[600px] p-6 shadow-lg w-[90%] h-[460px] rounded-2xl bg-navy flex flex-col justify-between items-center outline-none">
                                <div className='w-full flex flex-col gap-6'>
                                    <p className='text-center text-lg'>لطفا روش پرداخت را انخاب کنید</p>
                                    <div className='flex flex-col gap-3'>
                                        <div className='w-full flex gap-2 items-center'>
                                            <span>مبلغ ورودی ایونت:</span>
                                            <span className='text-lg font-bold'>{Number(singleEvent.entry_price).toLocaleString()}</span>
                                            <span className='text-sm'>تومان</span>
                                        </div>
                                        <div className='w-full flex gap-2 items-center'>
                                            <span>موجودی کیف پول:</span>
                                            <span className='text-lg font-bold'>{Number(userBalance?.data).toLocaleString()}</span>
                                            <span className='text-sm'>تومان</span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-3 w-full'>
                                        <div className='flex gap-2'>
                                            <label for="wallet">پرداخت از کیف پول</label>
                                            <input
                                                type="radio"
                                                id="wallet"
                                                name="payment"
                                                value="wallet"
                                                checked={paymentOption === "wallet"}
                                                onChange={(e) => setPaymentOption(e.target.value)}
                                            />
                                        </div>
                                        <div className='flex gap-2'>
                                            <label for="online">پرداخت آنلاین</label>
                                            <input
                                                type="radio"
                                                id="online"
                                                name="payment"
                                                value="online"
                                                checked={paymentOption === "online"}
                                                onChange={(e) => setPaymentOption(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {
                                        (paymentOption === 'wallet' && userBalance?.data <= singleEvent.entry_price) ?
                                            <p className='border border-secondary text-sm shadow-neon-blue-sm rounded-2xl px-4 py-3'>موجودی کیف پول شما برای شرکت در این ایونت کافی نیست. لطفا موجودی خود را افزایش دهید یا از پرداخت آنلاین استفاده کنید.</p>
                                            : <></>
                                    }
                                </div>
                                <RegularButton
                                    onClick={handlePurchase}
                                    disabled={(paymentOption === 'wallet' && userBalance?.data <= singleEvent.entry_price) || paymentbuttonDisabled}
                                    text={'پرداخت'}
                                />
                            </form>
                        </Modal>
                    </div>
            }
            <CancelEventModal singleEvent={singleEvent} hoursToEvent={hoursToEvent} openModal={openCancelEventModal} handleCloseModal={() => setOpenCancelEventModal(false)} />
        </div >
    )
}

export default PlayerSingleEvent