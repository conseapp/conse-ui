import React, { useEffect, useState } from 'react'
import { rolePicsID } from '../../utils/picsID'

const LearningCard = ({ card, type }) => {
    const [cardImage, setCardImage] = useState('');

    useEffect(() => {
        const getImage = async (path) => {
            try {
                const imageModule = await import(path);
                const image = imageModule.default;
                setCardImage(image);
            } catch (error) {
                console.error(error);
            }
        };

        if (type == 'modern-role' && rolePicsID.includes(card._id.$oid)) {
            getImage(`../../assets/roles/modern/${card._id.$oid}.jpg`);
        }
    }, [card._id.$oid]);

    return (
        <div className='relative w-full h-full flex flex-col justify-end'>
            {
                cardImage ?
                    <div className='flex-1 overflow-hidden relative'>
                        <img className='w-full' src={cardImage} />
                        <div className="absolute z-10 w-full h-full left-0 bottom-0 bg-gradient-to-b from-transparent from-40% to-gray-dark to-90%"></div>
                    </div>
                    : <></>
            }
            <span className='text-sm p-3'>{card.name}</span>
        </div>
    )
}

export default LearningCard