import React, { useEffect, useRef, useState } from 'react'
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { InputOutline, InputTransparent } from '../../components/ui/inputs';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createGroup, getGodGroups } from '../../api/gameApi';
import { OutlineButton, RegularButton, SubmitButton } from '../../components/ui/buttons';
import { ToastContainer, toast } from 'react-toastify';
import { IoWarningOutline } from "react-icons/io5";
import Circular from "../../components/ui/Circular"
import CropModal from '../../components/crop/CropModal';
import { uploadAvatarImg } from '../../api/panelApi';
import { getuser } from '../../redux/actions';
import { RegisterNewGod, editProfile, getAllUsers } from '../../api/authApi';
import { Modal } from '@mui/material';


const SetNewGod = () => {
    const globalUser = useSelector(state => state.userReducer)
    const [openModal, setOpenModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const client = useQueryClient()



    const { data: users, isLoading: usersLoading } =
        useQuery('all-users', () => getAllUsers(globalUser.accessToken), {
            refetchOnWindowFocus: false
        })

    const { mutate: addGodMutation } =
        useMutation(RegisterNewGod,
            {
                onSuccess: (result) => {
                    toast.success('کاربر با موفقیت به گرداننده تبدیل شد')
                    client.invalidateQueries('all-users')
                    setButtonDisabled(false)
                    setOpenModal(false)
                    setSelectedUser(null)
                },
                onError: (error) => {
                    toast.error('خطایی در هنگام انتخاب گرداننده پیش آمده')
                    setButtonDisabled(false)
                },
            })

    const addGod = async e => {
        if (selectedUser) {
            setButtonDisabled(true)

            const reqInfo = { token: globalUser.accessToken, id: selectedUser._id.$oid }
            addGodMutation(reqInfo)
        }
    }


    return (
        <div className='h-custom-screen flex flex-col items-center gap-6 overflow-auto'>
            <h2 className='text-xl w-full'>اتنخاب گرداننده جدید</h2>
            <div className='w-full'>
                <table className='w-full rounded-2xl overflow-hidden'>
                    <thead className='bg-navy'>
                        <tr className='border-b '>
                            <th className='p-4'>#</th>
                            <th colSpan={2} className='p-4 text-right'>نام کاربر</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.data.filter(user => user.access_level == 2).map((user, index) => {
                            return (
                                <tr key={user._id.$oid} className='border-b border-gray-light'>
                                    <td className='text-center p-3'>{index + 1}</td>
                                    <td className='p-3'>{user.username}</td>
                                    <td className='p-3'>
                                        <RegularButton
                                            onClick={() => {
                                                setSelectedUser(user)
                                                setOpenModal(true)
                                            }}
                                            text={'انتخاب'}
                                        />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                sx={{ backdropFilter: "blur(8px)", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <div className="min-w-[312px] gap-4 max-w-[400px] p-6 shadow-lg w-[80%] h-[250px] rounded-2xl bg-navy flex flex-col justify-between items-center outline-none">
                    <p className='text-center text-lg'>آیا از انتخاب {selectedUser?.username} به عنوان گرداننده مطمئن هستید ؟</p>
                    <div className='flex w-full gap-3'>
                        <RegularButton
                            onClick={addGod}
                            disabled={buttonDisabled}
                            text={'تایید'}
                        />
                        <OutlineButton text={'انصراف'} onClick={() => setOpenModal(false)} />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default SetNewGod