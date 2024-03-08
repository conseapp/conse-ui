import { useEffect, useState } from 'react'
import { Modal, OutlinedInput } from '@mui/material'
import { OutlineButton, RegularButton, TransparentButton } from '../ui/buttons'
import statuses from '../../utils/allPossibleStatus'
import { FaAngleDown } from 'react-icons/fa6'
import RoleSelectorOutline from '../ui/RoleSelectorOutline'
import { useDispatch, useSelector } from 'react-redux'
import { cancelEvent } from '../../api/walletApi'
import { toast } from 'react-toastify'

const CancelEventModal = ({ hoursToEvent, openModal, handleCloseModal, singleEvent }) => {
    const [Percentage, setPercentage] = useState(0)
    const globalUser = useSelector(state => state.userReducer)
    const { started_at, _id } = singleEvent


    useEffect(() => {
        if (hoursToEvent <= 1) { setPercentage(40) }
        if (hoursToEvent > 1 && hoursToEvent <= 5) { setPercentage(80) }
        if (hoursToEvent > 5) { setPercentage(95) }
    }, [hoursToEvent])

    const handleCancelEvent = async () => {
        const reqInfo = {
            token: globalUser.accessToken,
            userID: globalUser.id,
            eventID: _id.$oid,
            eventStartTime: started_at,
        }

        const response = await cancelEvent(reqInfo)
        console.log(response,'lol')
        if (response.status == 200) {
            handleCloseModal()
            toast.success(`ایونت با موفقیت لغو شد و ${Percentage} از مبلغ ایونت به حساب شما برگردانده شد.`)
        }
    }

    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            sx={{ backdropFilter: "blur(8px)", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <div className="min-w-[312px] gap-4 max-w-[400px] p-6 shadow-lg w-[80%] h-[300px] rounded-2xl bg-navy flex flex-col justify-between items-center outline-none">
                <h2 className='text-lg'>آیا از لغو ایونت  مطمئن هستید</h2>
                <p className='text-sm'>
                    با توجه به این که
                    <b className='text-lg text-secondary'>
                        {
                            (hoursToEvent <= 1) ? ' کمتر از 1 ساعت ' : <></>
                        }
                        {
                            (hoursToEvent > 1 && hoursToEvent <= 5) ? ' کمتر از 5 ساعت ' : <></>
                        }
                        {
                            (hoursToEvent > 5) ? ' بیشتر از 5 ساعت ' : <></>
                        }
                    </b>
                    به شروع ایونت مانده
                    <b className='text-lg text-secondary'> %{Percentage} </b>
                    درصد از مبلغ ایونت به کیف پول شما برمیگردد
                </p>
                <div className='flex gap-2 w-full'>
                    <RegularButton text={'تایید'} onClick={handleCancelEvent} />
                    <OutlineButton text={'لغو'} onClick={handleCloseModal} />
                </div>
            </div>
        </Modal>
    )
}

export default CancelEventModal