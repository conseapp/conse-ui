import { Fragment, useEffect, useState } from 'react'
import { FaAngleDown, FaSquareCheck } from 'react-icons/fa6'
import { RegularButton, TransparentButton } from '../ui/buttons'
import { IoMdClose } from 'react-icons/io'
import RoleCard from './RoleCard'


const RoleSelector = ({ roles, label, selectedRoles, setSelectedRoles, type }) => {
    const [open, setOpen] = useState(false)
    const [tempArray, setTempArray] = useState([])

    useEffect(() => {
        selectedRoles?.length > 0 ?
            setTempArray([...selectedRoles])
            : setTempArray([])
    }, [selectedRoles])


    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        selectedRoles?.length > 0 ?
            setTempArray([...selectedRoles])
            : setTempArray([])
    }

    const toggleSelect = (role) => {
        let newArr;

        if (tempArray?.indexOf(role) < 0 || tempArray?.indexOf(role) == undefined) {
            if (tempArray?.length > 0) {
                newArr = [...tempArray, role]
            }
            else { newArr = [role] }
        }
        else {
            newArr = [...tempArray]
            newArr.splice(tempArray.indexOf(role), 1)
        }


        setTempArray(newArr)
    }

    const removeSelected = (e, role) => {
        e.stopPropagation();
        let newArr = [...selectedRoles]
        newArr.splice(selectedRoles.indexOf(role), 1)
        setSelectedRoles(newArr)
    }

    const handleSubmit = () => {
        setSelectedRoles(tempArray)
        setOpen(false)
    }



    return (
        <>
            {
                (!selectedRoles?.length > 0) ?
                    <div onClick={handleOpen} className='relative w-full bg-navy placeholder-white cursor-pointer placeholder:text-sm  text-white text-sm rounded-2xl px-4 py-3.5'>
                        {label}
                        <FaAngleDown size={16} className="absolute left-4 top-4 pointer-events-none" />
                    </div>
                    :

                    <div className='flex flex-col'>
                        <span className='text-xs mr-4'>{label}</span>
                        <div onClick={handleOpen} className='relative cursor-pointer flex py-2 mt-2 px-3 pr-4 rounded-2xl border border-gray-light'>
                            <div className='flex flex-wrap gap-1 pl-4'>
                                {
                                    selectedRoles.map(selected => (
                                        <div
                                            key={`selected-role-${selected._id.$oid}`}
                                            className='bg-white rounded-2xl p-1 pr-2 flex '
                                            onClick={(e) => removeSelected(e, selected)}
                                        >
                                            <span className='text-[10px] text-black'>{selected.name}</span>
                                            <IoMdClose size={16} color='#C8237C' />
                                        </div>
                                    ))
                                }
                            </div>
                            <FaAngleDown size={16} className="absolute left-4 top-4 pointer-events-none" />
                        </div>
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
                                    let selected = !(tempArray?.indexOf(role) < 0 || tempArray?.indexOf(role) == undefined)
                                    return (
                                        // <div key={`role_${role._id.$oid}`} className='col-span-1 aspect-square flex items-center justify-center'>
                                        //     <div onClick={() => toggleSelect(role)} className={className}>
                                        //         {selected &&
                                        //             <FaSquareCheck size={24} className="text-secondary" />
                                        //         }
                                        //         <span>
                                        //             {role.name}
                                        //         </span>
                                        //     </div>
                                        // </div>
                                        <Fragment key={`role_${role._id.$oid}`}>
                                            <RoleCard card={role} type={type} selected={selected} toggleSelect={toggleSelect} />
                                        </Fragment>
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

export default RoleSelector