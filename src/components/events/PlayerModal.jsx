import { useState } from 'react'
import { Modal } from '@mui/material'
import { RegularButton, TransparentButton } from '../ui/buttons'

const PlayerModal = ({ openModal, handleCloseModal, activePlayer }) => {


    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            sx={{ backdropFilter: "blur(8px)" }}
        >
            <div className="min-w-[312px] max-w-[400px] p-6 shadow-lg w-[80%] h-[512px] rounded-2xl bg-navy absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col justify-between items-center outline-none">
                <h3 className="text-lg w-full">
                    وضعیت بازیکن {activePlayer.username}
                </h3>
                <div className="w-full flex">
                    <RegularButton text='ذخیره' />
                    <TransparentButton onClick={handleCloseModal} text='لغو' />
                </div>
            </div>
        </Modal>
    )
}

export default PlayerModal