import { TextInput, TextareaInput } from "../../components/ui/inputs"
import DateObject from "react-date-object";
import DateInput from "../../components/ui/DateInput";
import { useState } from "react";
import { SubmitButton } from "../../components/ui/buttons";
import { useMutation, useQuery } from "react-query";
import { getGodGroups } from "../../api/gameApi";
import { createEvent } from "../../api/eventApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const globalUser = useSelector(state => state.userReducer)
  const navigate = useNavigate()
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
  const [eventForm, setEventForm] = useState({
    title: '',
    content: '',
    started_at: '',
  })

  const { data: groups, isLoading: groupIsLoading } = useQuery('groups', () => {
    if (globalUser.accessLevel === 0 || globalUser.accessLevel === 1) {
      return getGodGroups(globalUser.accessToken, globalUser.id)
    } else {
      return Promise.resolve([])
    }
  }, {
    refetchOnWindowFocus: false
  })

  const { mutate: createEventMutation } = useMutation(createEvent,
    {
      onSuccess: (result) => {
        toast.success('ایونت با موفقیت ایجاد شد')
        setEventForm({
          title: null,
          content: null,
          started_at: null,
        })
        navigate('/mafia/manage/events', { state: { from: '/mafia/manage', backButton: true, goToFrom: true }, replace: true })
        // client.invalidateQueries('events')
      },
      onError: (error) => {
        toast.error('خطایی در هنگام ساخت ایونت پیش آمده')
      },
    })


  const handleFormChange = (e) => {
    setEventForm(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const handleDateChange = value => {
    setEventForm(prev => ({
      ...prev,
      started_at: value
    }))
  }

  const SubmitEvent = async e => {
    e.preventDefault()

    const { title, content, started_at } = eventForm

    let group_info = groups.data.groups.at(-1)
    if (group_info)
      group_info._id = group_info._id.$oid

    let body = {
      title: title,
      content: content,
      deck_id: '',
      entry_price: '0',
      group_info: group_info,
      creator_wallet_address: "0x0000000000000000000000000000000000000000",
      upvotes: 0,
      downvotes: 0,
      voters: [],
      phases: [],
      max_players: 0,
      players: [],
      started_at: started_at.add(5, "minute").unix
    }

    const reqInfo = {
      body: body,
      token: globalUser.accessToken,
    }

    createEventMutation(reqInfo)
  }

  const test = []
  return (
    <div className="h-custom-screen overflow-auto flex flex-col items-center gap-8 pb-4">
      <h2 className='text-xl w-full'>افزودن ایونت</h2>
      {
        groupIsLoading ?
          <></> :
          groups.data.groups.length ?
            <form className="flex flex-col justify-between h-full w-full" onSubmit={SubmitEvent}>
              <div className="flex flex-col gap-6 w-full">
                <TextInput id='title' value={eventForm.title} placeholder={'نام ایونت'} onChange={handleFormChange} />
                <TextareaInput id='content' value={eventForm.content} placeholder={'توضیحات'} onChange={handleFormChange} />
                <DateInput id='started_at' placeholder={"زمان شروع بازی"} onChange={handleDateChange} value={eventForm.started_at} />
              </div>
              <SubmitButton text={'افزودن ایونت'} disabled={submitButtonDisabled || !Object.values(eventForm).every(value => value !== null && value !== "")} id='create-event-button' />
            </form>
            :
            <p className='text-sm flex gap-2 items-center w-full'>
              <IoWarningOutline size={24} color='#FF6B00' />
              برای ساخت ایونت باید گروه داشته باشید.
            </p>
      }
    </div>
  )
}

export default CreateEvent