import { useEffect, useState } from 'react'
import { FaAngleDown, FaSquareCheck } from 'react-icons/fa6'
import { RegularButton, TransparentButton } from '../ui/buttons'
import { IoMdClose } from 'react-icons/io'

const RoleSelectorOutline = ({ roles, label, selectedRole, setSelectedRole }) => {
    const [open, setOpen] = useState(false)
    const [tempSelect, setTempSelect] = useState({})

    useEffect(() => {
        !!selectedRole ?
            setTempSelect(selectedRole)
            : setTempSelect({})
    }, [selectedRole])


    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        !!selectedRole ?
            setTempSelect(selectedRole)
            : setTempSelect({})
    }

    const toggleSelect = (role) => {
        setTempSelect(role)
    }

    const handleSubmit = () => {
        setSelectedRole(tempSelect)
        setOpen(false)
    }



    return (
        <>
            {
                // (!selectedRole?.length > 0) ?
                <div onClick={handleOpen} className='flex relative w-full bg-navy border border-gray-light rounded-2xl placeholder-white cursor-pointer placeholder:text-sm  text-white text-sm px-4 mt-3.5 py-3.5'>
                    <span className='text-xs bg-navy absolute top-[-8px] px-1'>{label}</span>
                    <FaAngleDown size={16} className="absolute left-4 top-4 pointer-events-none" />
                    {
                        !!selectedRole ?
                            <span className='w-full inline-block'>{selectedRole.name}</span>
                            :
                            <span>نقش بازیکن</span>
                    }
                </div>

            }


            {
                open &&
                <div className='transition-all absolute w-full h-full bottom-0 left-0 backdrop-blur-md z-50'>
                    <div className='pb-8 h-[95%] transition-all flex flex-col rounded-t-xl p-4 absolute bg-navy w-full bottom-0 left-0'>
                        <div className='w-16 self-end'>
                            <TransparentButton fontSize='sm' text={'بستن'} onClick={handleClose} />
                        </div>
                        <h3 className='w-full text-center pb-4'>انتخاب {label}</h3>
                        <div className='overflow-auto w-full grid grid-cols-2 gap-4 justify-center'>
                            {
                                roles?.map((role) => {
                                    let selected = tempSelect._id == role._id
                                    let className;
                                    selected ? className = 'border border-secondary shadow-neon-blue-sm bg-gray-dark w-full max-w-[312px] p-3 aspect-square rounded-2xl flex flex-col justify-between'
                                        : className = 'bg-gray-dark w-full max-w-[312px] p-3 aspect-square rounded-2xl flex items-end'

                                    return (
                                        <div key={`role_${role._id}`} className='col-span-1 aspect-square flex items-center justify-center'>
                                            <div onClick={() => toggleSelect(role)} className={className}>
                                                {selected &&
                                                    <FaSquareCheck size={24} className="text-secondary" />
                                                }
                                                <span>
                                                    {role.name}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='w-full flex-1 pt-2 flex items-end'>
                            <RegularButton onClick={handleSubmit} text='تایید' />
                        </div>
                    </div>
                </div >
            }
        </>
    )
}

export default RoleSelectorOutline