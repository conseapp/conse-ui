import { OutlineLinkButton } from '../ui/navigationButtons'
import { DateObject } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const EventCardCol = ({ name, date, god, capacity, BgPic, path, key }) => {
    const startTime = new DateObject({
        date: date * 1000,
        calendar: persian,
        locale: persian_fa,
    })

    return (
        <div key={key} className="flex flex-col w-[calc(50%-6px)] aspect-[4/5] shadow-lg max-w-xl bg-gray-dark rounded-2xl overflow-hidden">
            <div className="relative w-full h-1/2">
                <div className='w-full h-full overflow-hidden'>
                    <img className="w-full relativeس" src={BgPic} alt="" />
                </div>
                <div className="absolute z-10 w-full h-full left-0 top-0 bg-gradient-to-b from-transparent from-40% to-gray-dark to-100%"></div>
            </div>
            <div className="w-full flex flex-col px-4 gap-1 justify-evenly h-1/2 relative bottom-1">
                <div className="flex flex-col gap-1">
                    <h3 className="text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">{name}</h3>
                    <span className="text-sm">{`${startTime.format("D MMMM")} - ساعت ${startTime.format("HH:mm")}`}</span>
                    <span className="text-sm overflow-ellipsis whitespace-nowrap">{`گرداننده: ${god}`}</span>
                </div>
                <OutlineLinkButton path={path} text={'بیشتر'} />
            </div>
        </div>
    )
}

export default EventCardCol