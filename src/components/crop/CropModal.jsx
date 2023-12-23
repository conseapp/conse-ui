import { Modal } from "@mui/material"
import Crop from "./Crop"
import { IoMdClose } from "react-icons/io"

const CropModal = ({ openCrop, setOpenCrop, photoURL, setPhotoURL, setImageFile, aspectRatio }) => {
    return (
        <Modal
            open={openCrop}
            onClose={() => setOpenCrop(false)}
        >
            <div className="w-full h-full flex justify-center items-center outline-none">
                <div className="bg-navy xs:rounded-3xl w-full h-full xs:h-auto xs:w-[600px] flex flex-col p-8 justify-between items-center" >
                    <div className="flex w-full justify-between items-center pb-2.5">
                        <div onClick={() => {
                            setOpenCrop(false)
                        }}>
                            <IoMdClose size={20} className="cursor-pointer" />
                        </div>
                    </div>
                    <Crop imageURL={photoURL} aspectRatio={aspectRatio} setOpenCrop={setOpenCrop} setFile={setImageFile} setPhotoURL={setPhotoURL} />
                </div>
            </div>
        </Modal>
    )
}

export default CropModal