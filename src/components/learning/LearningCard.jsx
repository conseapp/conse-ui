import React, { useEffect, useState } from 'react'
import { rolePicsID } from '../../utils/picsID'

const LearningCard = ({ card, type }) => {
    return (
        (type == 'modern-role') ?
            <div className='relative w-full h-full flex flex-col justify-end'>
                <div className='flex-1 overflow-hidden relative'>
                    <img className='w-full' src={`/roles/modern/${card._id.$oid}.jpg`} />
                    <div className="absolute z-10 w-full h-full left-0 bottom-0 bg-gradient-to-b from-transparent from-40% to-gray-dark to-90%"></div>
                </div>
                <span className='text-sm p-3'>{card.name}</span>
            </div>
            :
            <div className='relative w-full h-full flex flex-col justify-end'>
                <div className='flex-1 overflow-hidden relative'>
                    <img className='w-full' src={`/roles/classic/${card._id.$oid}.jpg`} />
                    <div className="absolute z-10 w-full h-full left-0 bottom-0 bg-gradient-to-b from-transparent from-40% to-gray-dark to-90%"></div>
                </div>
                <span className='text-sm p-3'>{card.name.replace('cp/','')}</span>
            </div>
    )
}

export default LearningCard