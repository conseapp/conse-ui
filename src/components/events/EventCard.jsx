import { OutlineLinkButton } from '../ui/navigationButtons'
import { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const EventCard = ({ name, date, god, capacity, BgPic, path, key }) => {
    const startTime = new DateObject({
        date: date * 1000,
        calendar: persian,
        locale: persian_fa,
    })

    return (
        <div key={key} className="flex w-full aspect-2/1 flex-shrink-0 shadow-lg bg-gray-dark rounded-2xl overflow-hidden">
            <div className="w-7/12 flex flex-col p-4 justify-evenly">
                <div className="flex flex-col gap-2">
                    <h3 className="text-sm">{name}</h3>
                    <span className="text-sm">{`${startTime.format("D MMMM")} - ساعت ${startTime.format("HH:mm")}`}</span>
                </div>
                <span className="text-sm">{`گرداننده: ${god}`}</span>
                <div className='w-24 flex'>
                    <OutlineLinkButton path={path} text={'بیشتر'} />
                </div>
            </div>
            <div className="relative w-5/12 bg-gradient-main">
                <img className="aspect-custom w-full" src={BgPic} alt="" />
                <div className="absolute z-10 w-full h-full left-0 top-0 bg-gradient-to-r from-transparent from-40% to-gray-dark to-100%"></div>
            </div>
        </div>
    )
}

export default EventCard