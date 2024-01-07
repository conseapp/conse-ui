import React, { useEffect, useState } from 'react'
import { rolePicsID } from '../../utils/picsID'
import { Modal } from "@mui/material"
import { TransparentButton } from "../ui/buttons"

const LearningModal = ({ openModal, handleClose, selectedCard }) => {
    // const [cardImage, setCardImage] = useState('');

    // useEffect(() => {
    //     const getImage = async () => {
    //         if (selectedCard?.type == 'modern-role' && rolePicsID.includes(selectedCard?.card._id.$oid)) {
    //             const image = await import(`../../assets/roles/modern/${selectedCard?.card._id.$oid}.jpg`)
    //             setCardImage(image.default)
    //         }
    //     };

    //     getImage()
    // }, [selectedCard?.card._id.$oid]);

    const closeModal = () => {
        handleClose()
        setCardImage('')
    }

    return (
        <Modal
            open={openModal}
            onClose={closeModal}
            sx={{ backdropFilter: "blur(8px)", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <div className="min-w-[312px] gap-4 max-w-[400px] p-4 shadow-lg w-[80%] rounded-2xl bg-navy flex flex-col justify-between items-center outline-none">
                <div className='relative overflow-hidden w-full bg-gray-dark aspect-4/3 rounded-lg'>
                    {
                        selectedCard?.card.name.substring(0, 3) == 'cp/' ?
                            <img className='absolute w-full top-0 left-0' src={`/roles/classic/${selectedCard?.card._id.$oid}.jpg`} />
                            :
                            <img className='absolute w-full top-0 left-0' src={`/roles/modern/${selectedCard?.card._id.$oid}.jpg`} />
                    }
                </div>
                <h2 className='text-lg w-full'>{selectedCard?.card.name.replace('cp/', '')}</h2>
                <p dangerouslySetInnerHTML={{ __html: selectedCard?.card.desc }} className='text-justify'></p>
                <div className="w-full flex-1 flex flex-col justify-end">
                    <TransparentButton onClick={closeModal} text='بستن' />
                </div>
            </div>
        </Modal>
    )
}

export default LearningModal