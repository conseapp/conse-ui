import { ImageInput, TextInput, TextareaInput } from "../../components/ui/inputs"
import DateObject from "react-date-object";
import DateInput from "../../components/ui/DateInput";
import { useRef, useState } from "react";
import { RegularButton, SubmitButton } from "../../components/ui/buttons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getGodGroups } from "../../api/gameApi";
import { createEvent, getSingleGodEvent } from "../../api/eventApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Circular from "../../components/ui/Circular";
import CropModal from "../../components/crop/CropModal";
import { uploadEventImg } from "../../api/panelApi";


const EditEvent = () => {
    const globalUser = useSelector(state => state.userReducer)
    const { eventId } = useParams()
    const navigate = useNavigate()
    const client = useQueryClient()
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
    const [uploadButtonDisabled, setUploadButtonDisabled] = useState(false)
    const [openCrop, setOpenCrop] = useState(false)
    const [photoURL, setPhotoURL] = useState(null)
    const [imageFile, setImageFile] = useState(null)
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

    const { data: singleGodEvent, isLoading: singleGodEventIsLoading, isFetching: singleGodEventIsFetching } = useQuery([`single-god-event-${eventId}`], () => {
        const reqInfo = { token: globalUser.accessToken, eventId: eventId }
        if (globalUser.accessLevel === 0 || globalUser.accessLevel === 1) {
            return getSingleGodEvent(reqInfo)
        } else {
            return Promise.resolve([])
        }
    }, {
        onSuccess: (result) => {
            setEventForm({
                title: result.data.title,
                content: result.data.content,
                started_at: new DateObject(result.data.started_at * 1000),
            })
            // if (result.data.image_path)
            //     setPhotoURL(result.data.image_path)
        },
        onError: (error) => {
            toast.error('خطایی در هنگام دریافت ایونت پیش آمده')
            console.log(error);
        },
        refetchOnWindowFocus: false
    })

    const { mutate: createEventMutation } = useMutation(createEvent,
        {
            onSuccess: (result) => {
                toast.success('ایونت با موفقیت آپدیت شد')
                setEventForm({
                    title: null,
                    content: null,
                    started_at: null,
                })
                navigate('/mafia/manage/events', { state: { from: '/mafia/manage', backButton: true, goToFrom: true }, replace: true })
                client.invalidateQueries(['god-events', `single-god-event-${eventId}`])
            },
            onError: (error) => {
                toast.error('خطایی در هنگام ویرایش ایونت پیش آمده')
            },
        })
    const { mutate: UploadEventImgMutation } = useMutation(uploadEventImg,
        {
            onSuccess: (result) => {
                toast.success('تصویر ایونت با موفقیت آپدیت شد')
                client.invalidateQueries(['god-events', `single-god-event-${eventId}`])
            },
            onError: (error) => {
                toast.error('خطایی در هنگام ویرایش ایونت پیش آمده')
            },
            onSettled: () => {
                setUploadButtonDisabled(false)
            }
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPhotoURL(URL.createObjectURL(file));
            setOpenCrop(true);
        }
    };

    const SubmitEvent = async e => {
        e.preventDefault()

        const { title, content, started_at } = eventForm

        let group_info = groups.data.groups.at(-1)
        if (group_info)
            group_info._id = group_info._id.$oid

        let body = {
            title: title,
            content: content,
            deck_id: singleGodEvent.data.deck_id,
            entry_price: singleGodEvent.data.entry_price,
            group_info: group_info,
            creator_wallet_address: singleGodEvent.data.creator_wallet_address,
            upvotes: singleGodEvent.dataupvotes,
            downvotes: singleGodEvent.datadownvotes,
            voters: singleGodEvent.data.voters,
            phases: singleGodEvent.data.phases,
            max_players: singleGodEvent.data.max_players,
            players: singleGodEvent.data.players,
            started_at: started_at.add(5, "minute").unix
        }

        const reqInfo = {
            body: body,
            token: globalUser.accessToken,
        }

        createEventMutation(reqInfo)
    }

    const fileUploadHandler = async event => {
        setUploadButtonDisabled(true)
        const myFile = new File([imageFile], 'image.jpeg', {
            type: imageFile.type,
        });

        const formData = new FormData();
        formData.append('img', myFile)

        const reqInfo = {
            token: globalUser.accessToken,
            eventId: singleGodEvent.data._id.$oid,
            fd: formData
        }

        UploadEventImgMutation(reqInfo)

    }

    const test = []
    return (
        <div className="h-custom-screen overflow-auto flex flex-col items-center gap-8 pb-4">
            <h2 className='text-xl w-full'>ویرایش ایونت</h2>
            {
                (groupIsLoading && singleGodEventIsFetching) ?
                    <Circular /> :
                    (groups.data.groups.length) ?
                        singleGodEvent ?
                            <form className="flex flex-col justify-between items-center h-full w-full gap-6" onSubmit={SubmitEvent}>
                                <div className="flex flex-col gap-6 w-full items-center">
                                    <TextInput readOnly id='title' value={eventForm.title} placeholder={'نام ایونت'} onChange={handleFormChange} />
                                    <TextareaInput id='content' value={eventForm.content} placeholder={'توضیحات'} onChange={handleFormChange} />
                                    <DateInput id='started_at' value={eventForm.started_at} placeholder={"زمان شروع بازی"} onChange={handleDateChange} />
                                    <ImageInput photoURL={imageFile ? photoURL : `https://panel.api.conse.app/${singleGodEvent?.data.image_path}`} onChange={handleImageChange} text={'انتخاب تصویر'} />
                                    {
                                        imageFile &&
                                        <div className="w-3/4">
                                            <RegularButton onClick={fileUploadHandler} text={'آپلود'} disabled={uploadButtonDisabled} id='upload-image-button' />
                                        </div>
                                    }
                                </div>
                                <SubmitButton text={'ویرایش ایونت'} disabled={submitButtonDisabled || !Object.values(eventForm).every(value => value !== null && value !== "")} id='create-event-button' />
                            </form>
                            :
                            <p className='text-sm flex gap-2 items-center w-full'>
                                ایونت مورد نظر یافت نشد
                            </p>
                        :
                        <p className='text-sm flex gap-2 items-center w-full'>
                            <IoWarningOutline size={24} color='#FF6B00' />
                            برای ساخت ایونت باید گروه داشته باشید.
                        </p>
            }

            <CropModal
                openCrop={openCrop}
                setOpenCrop={setOpenCrop}
                photoURL={photoURL}
                setPhotoURL={setPhotoURL}
                setImageFile={setImageFile}
                aspectRatio={4 / 3}
            />
        </div>
    )
}

export default EditEvent


