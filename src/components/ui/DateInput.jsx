import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/layouts/mobile.css"
import { FaAngleDown } from "react-icons/fa6"
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"
import "react-multi-date-picker/styles/colors/purple.css"


// import styles from "../styles/components/date-input.module.scss"

export default function DateInput({ onChange, value, placeholder, id }) {
  return (
    <div className="w-full flex flex-col relative">
      <DatePicker
        inputClass="w-full bg-navy placeholder-white cursor-pointer placeholder:text-sm  text-white focus:border focus:ring-secondary focus:border-secondary focus-visible:border focus-visible:ring-secondary focus-visible:border-secondary focus-visible:outline-none text-sm rounded-2xl block px-4 py-3.5"
        placeholder={placeholder}
        value={value}
        className="rmdp-mobile purple bg-dark "
        onChange={onChange}
        format="HH:mm - YYYY/MM/DD"
        plugins={[
          <TimePicker hideSeconds position="bottom" key={''} />
        ]}
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        id={id}
      />
      <FaAngleDown size={20} className="absolute left-4 top-4 pointer-events-none"/>
    </div>
  )
}
