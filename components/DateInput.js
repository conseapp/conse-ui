import React from 'react'
import DateObject from "react-date-object";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import InputIcon from "react-multi-date-picker/components/input_icon"
import "react-multi-date-picker/styles/layouts/mobile.css"
import styles from "../styles/components/date-input.module.scss"

export default function DateInput({onChange, value}) {
  return (
    <DatePicker
      value={value}
      inputClass={styles.date_input}
      className="rmdp-mobile"
      onChange={onChange}
      format="HH:mm - YYYY/MM/DD"
      plugins={[
        <TimePicker hideSeconds position="bottom" />
      ]}
      calendar={persian}
      locale={persian_fa}
      calendarPosition="bottom-right"
    />
  )
}
