import React, { useEffect, useState } from 'react'
import { MdEdit } from "react-icons/md";
import { useSelector } from 'react-redux';
import { InputOutline, InputTransparent } from '../../components/ui/inputs';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { createGroup, getGodGroups } from '../../api/gameApi';
import { SubmitButton } from '../../components/ui/buttons';
import { ToastContainer, toast } from 'react-toastify';
import { IoWarningOutline } from "react-icons/io5";
import Circular from "../../components/ui/Circular"


const UserAccountInfo = () => {
  const globalUser = useSelector(state => state.userReducer)
  const [canCreateGroup, setcanCreateGroup] = useState(false)
  const [groupName, setGroupName] = useState('')
  const client = useQueryClient()

  const { data: groups, isLoading: groupIsLoading } =
    useQuery('groups', () => {
      if (globalUser.accessLevel === 0 || globalUser.accessLevel === 1) {
        return getGodGroups(globalUser.accessToken, globalUser.id)
      } else {
        return Promise.resolve([])
      }
    }, {
      refetchOnWindowFocus: false
    })

  const { mutate: createGroupMutation } =
    useMutation(createGroup,
      {
        onSuccess: (result) => {
          toast.success('گروه با موفقیت ایجاد شد')
          client.invalidateQueries('groups')
        },
        onError: (error) => {
          toast.error('خطایی در هنگام ساخت گروه پیش آمده')
        },
      })


  useEffect(() => {
    if (groups?.status == 200)
      if (groups.data.groups?.length === 0) {
        setcanCreateGroup(true)
      }
      else {
        setcanCreateGroup(false)
        setGroupName(groups.data.groups[0]?.name)
      }
  }, [groups])


  const handleCreateGroup = (e) => {
    e.preventDefault()
    const reqInfo = {
      token: globalUser.accessToken,
      name: groupName,
      owner: globalUser.username,
      god_id: globalUser.id,
    }
    if (groupName !== '') {
      createGroupMutation(reqInfo)
    } else
      toast.warning('لطفا نام گروه را وارد کنید')
  }

  return (
    <div className='flex flex-col items-center gap-6'>
      <h2 className='text-xl w-full'>اطلاعات حساب</h2>
      <div className='relative inline-block rounded-full p-[1px] bg-gradient-to-br from-primary-light from-30% to-gray to-95% drop-shadow-neon'>
        <div className='w-28 h-28 rounded-full bg-gray'></div>
        <div className='bg-navy flex justify-center items-center w-10 h-10 absolute left-10 bottom-[-16px] rounded-full'>
          <MdEdit className='text-primary-light' size={24} />
        </div>
      </div>
      <div className='w-full'>
        <label
          htmlFor="username"
          className=" text-[12px] px-1 relative top-2 right-4 bg-[#341847]"
        >
          نام و نام خانوادگی
        </label>
        <InputOutline id={'username'} disabled={globalUser.username} value={globalUser.username} />
      </div>
      {
        (globalUser.accessLevel == 0 || globalUser.accessLevel == 1) &&
          groupIsLoading ? <Circular />
          :
          <form onSubmit={handleCreateGroup} className='flex flex-col w-full gap-6'>
            <div>
              <label
                htmlFor="group"
                className=" text-[12px] px-4 text-[#727272]"
              >
                نام گروه
              </label>
              {
                canCreateGroup ?
                  <InputTransparent id='group' placeholder={'نام گروه را وارد کنید'}
                    value={groupName}
                    onChange={(e) => { setGroupName(e.target.value) }}
                  />
                  :
                  <InputTransparent id='group' placeholder={'عنوان نام گروه'}
                    value={groupName}
                    disabled={true}
                  />
              }
            </div>
            {
              canCreateGroup ?
                <SubmitButton text={'ساخت گروه'} />
                :
                <p className='text-sm flex gap-2 items-center px-4'>
                  <IoWarningOutline size={24} color='#FF6B00' />
                  برای تغییر نام گروه نیاز به تماس با پشتیبانی دارید.
                </p>
            }
          </form>
      }
    </div>
  )
}

export default UserAccountInfo