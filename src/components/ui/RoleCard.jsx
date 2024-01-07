import React, { useEffect, useState } from 'react'
import { rolePicsID } from '../../utils/picsID'
import { FaSquareCheck } from 'react-icons/fa6';

const RoleCard = ({ card, type, selected, toggleSelect }) => {
    return (
        <div key={`role_${card._id.$oid}`} className='col-span-1 aspect-square flex items-center justify-center'>
            <div onClick={() => toggleSelect(card)}
                className={selected ?
                    'relative border border-secondary shadow-neon-blue-sm bg-gray-dark w-full max-w-[312px] overflow-hidden aspect-square rounded-2xl flex flex-col justify-end'
                    : 'bg-gray-dark w-full max-w-[312px] overflow-hidden aspect-square rounded-2xl flex flex-col justify-end'
                }>

                {
                    (type == 'modern-role') ?
                        <div className='flex-1 overflow-hidden relative'>
                            <img className='w-full' src={`/roles/modern/${card._id.$oid}.jpg`} />
                            <div className="absolute z-10 w-full h-full left-0 bottom-0 bg-gradient-to-b from-transparent from-40% to-gray-dark to-90%"></div>
                        </div>
                        : <></>
                }
                <span className='pb-3 pr-3'>
                    {card.name}
                </span>
                {selected &&
                    <FaSquareCheck size={24} className="text-secondary absolute top-3 left-3" />
                }
            </div>
        </div>
    )
}

export default RoleCard