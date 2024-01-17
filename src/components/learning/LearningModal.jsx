import React, { useEffect, useState } from 'react'
import { rolePicsID } from '../../utils/picsID'
import { Modal } from "@mui/material"
import { TransparentButton } from "../ui/buttons"
import { useSelector } from 'react-redux'
import { getRoleImg } from '../../api/rolesApi'

const LearningModal = ({ openModal, handleClose, selectedCard }) => {
    const globalUser = useSelector(state => state.userReducer)
    const [roleImg, setRoleImg] = useState(null)


    const handleGetRoleImg = async () => {
        const response = await getRoleImg({
            token: globalUser.accessToken,
            roleId: selectedCard?.card._id.$oid,
            gameId: selectedCard?.card.name.substring(0, 3) == 'cp/' ? 2 : 1
        })
        setRoleImg(URL.createObjectURL(response))
    }

    useEffect(() => {
        if (selectedCard?.card._id.$oid) {
            handleGetRoleImg()
        }
        console.log(selectedCard);

    }, [openModal])

    const closeModal = () => {
        handleClose()
        setRoleImg(null)
    }

    return (
        <Modal
            open={openModal}
            onClose={closeModal}
            sx={{ backdropFilter: "blur(8px)", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <div className="min-w-[312px] gap-4 max-w-[400px] p-4 shadow-lg w-[80%] rounded-2xl bg-navy flex flex-col justify-between items-center outline-none">
                <div className='relative overflow-hidden w-full bg-gray-dark aspect-4/3 rounded-lg'>
                    <img className='absolute w-full top-0 left-0' src={roleImg} />
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