import React, { useEffect, useState } from 'react'
import { rolePicsID } from '../../utils/picsID'
import { FaSquareCheck } from 'react-icons/fa6';
import { useInView } from 'react-intersection-observer';
import { useSelector } from 'react-redux';
import { getCardImg, getRoleImg } from '../../api/rolesApi';



const RoleCard = ({ card, type, selected, toggleSelect }) => {
    const globalUser = useSelector(state => state.userReducer)
    const [roleImg, setRoleImg] = useState(null)


    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
        triggerOnce: true
    });

    const handleGetRoleImg = async () => {
        const response = await getRoleImg({ token: globalUser.accessToken, roleId: card?._id.$oid, gameId: type == 'modern-role' ? 1 : 2 })
        setRoleImg(URL.createObjectURL(response))
    }

    const handleGetCardImg = async () => {
        const response = await getCardImg({ token: globalUser.accessToken, cardId: card?._id.$oid })
        setRoleImg(URL.createObjectURL(response))
    }

    useEffect(() => {
        if (inView && (type == 'modern-role' || type == 'classic-role')) {
            handleGetRoleImg()
        }
        if (inView && (type == 'last-move-card')) {
            handleGetCardImg()
        }

    }, [inView])

    const selectedClassName = `relative border border-secondary shadow-neon-blue-sm bg-gray-dark w-full max-w-[312px] overflow-hidden ${type == 'last-move-card' ? 'aspect-4/3' : 'aspect-square'} rounded-2xl flex flex-col justify-end`
    const normalClassName = `bg-gray-dark w-full max-w-[312px] overflow-hidden ${type == 'last-move-card' ? 'aspect-4/3' : 'aspect-square'} rounded-2xl flex flex-col justify-end`

    return (
        <div key={`role_${card._id.$oid}`} className='col-span-1 aspect-square flex items-center justify-center'>
            <div ref={ref} onClick={() => toggleSelect(card)}
                className={selected ?
                    selectedClassName
                    : normalClassName
                }>

                {
                    (type == 'modern-role' || type == 'classic-role') ?
                        <div className='flex-1 overflow-hidden relative'>
                            <img className='w-full' src={roleImg} />
                            <div className="absolute z-10 w-full h-full left-0 bottom-0 bg-gradient-to-b from-transparent from-40% to-gray-dark to-90%"></div>
                        </div>
                        :
                        <div className='flex-1 overflow-hidden relative'>
                            <img className='w-full' src={roleImg} />
                            <div className="absolute z-10 w-full h-full left-0 bottom-0 bg-gradient-to-b from-transparent from-40% to-gray-dark to-90%"></div>
                        </div>
                }
                <span className='pb-3 pr-3'>
                    {
                        type == 'classic-role' ?
                            card.name.replace('cp/', '')
                            :
                            card.name
                    }
                </span>
                {selected &&
                    <FaSquareCheck size={24} className="text-secondary absolute top-3 left-3" />
                }
            </div>
        </div>
    )
}

export default RoleCard