import { useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { RegularButton, OutlineButton, CancelButton } from "../../components/ui/buttons";
import { useLocation, useNavigate } from 'react-router-dom';
import BgPic from '../../assets/james-bond-cover.jpg'



const GodSingleEvent = ({ singleEvent, startTime }) => {

    const [open, setIsOpen] = useState(false);
    const [height, setHeight] = useState(360);
    const [bgImage, setBgImage] = useState('')
    const navigate = useNavigate()
    const location = useLocation()


    const handlers = useSwipeable({
        onSwipedUp: () => {
            setHeight(530)
            setTimeout(() => {
                setIsOpen(true)
            }, 100);
        },
        onSwipedDown: () => {
            setHeight(360)
            setIsOpen(false)
        },
        // swipeDuration: 500,
        // preventScrollOnSwipe: true,
        trackMouse: true
    });

    useEffect(() => {
        !!singleEvent.image_path ? setBgImage(`https://panel.api.conse.app/${singleEvent.image_path}`) : setBgImage(BgPic)


    }, [singleEvent.image_path])



    return (
        <div className='pb-[280px] flex flex-col items-center gap-2 justify-end h-full'>
            <div style={{ backgroundImage: `url(${bgImage})` }} className='w-full aspect-4/3 bg-cover absolute top-0 left-0 -z-10 bg-no-repeat bg-center'>
                <div className="absolute w-full h-full left-0 top-0 bg-gradient-to-b from-transparent from-40% to-[#361849] to-100%"></div>
            </div>
            <div className='flex flex-col items-center gap-2 justify-end h-full'>
                <div className='flex flex-col items-center gap-2 h-40 justify-center'>
                    <h2 className='w-full text-center text-xl'>{singleEvent.title}</h2>
                    <span className="text-sm">{`${startTime.format("D MMMM")} - ساعت ${startTime.format("HH:mm")}`}</span>
                </div>
                <div
                    {...handlers}
                    style={{ height: `${height}px` }}
                    className='pb-20 transition-all flex flex-col items-center rounded-t-xl p-4 absolute bg-navy w-full bottom-0 left-0 z-10'
                >
                    <div className='relative bg-gray w-10 h-1 rounded-lg shrink-0'></div>
                    <div className='absolute left-6 top-8'>
                        <CancelButton text='لغو ایونت' />
                    </div>
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
                            {/*
                         <div className='flex flex-col w-full gap-1'>
                            <span className='text-gray-light text-sm'>تعداد بازیکنان</span>
                            <span>{singleEvent}</span>
                        </div> 
                        */}
                            <div className='flex flex-col w-full gap-1'>
                                <span className='text-gray-light text-sm'>سناریو</span>
                                <span>{singleEvent.content}</span>
                            </div>
                        </div>
                        {
                            open &&
                            <div className='w-full flex flex-col items-center py-4 px-2  gap-4'>
                                <RegularButton
                                    onClick={() =>
                                        navigate('players', { state: { from: location.pathname, backButton: true } })
                                    } text='مشاهده لیست بازیکنان' />

                                <OutlineButton
                                    onClick={() =>
                                        navigate('history', { state: { from: location.pathname, backButton: true } })
                                    }
                                    text='تاریخچه بازی'
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GodSingleEvent