import { useState } from 'react'
import { Typography, Slider, Button } from '@mui/material'
import Cropper from 'react-easy-crop'
import getCroppedImg from './utils/cropImage'

function Crop({ imageURL, aspectRatio, setOpenCrop, setFile, setPhotoURL }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const cropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const handleCropImage = async () => {
        try {
            const { file, url } = await getCroppedImg(imageURL, croppedAreaPixels, rotation)
            setFile(file)
            setPhotoURL(url)
            setOpenCrop(false)
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <>
            <div className='bg-navy relative h-[400px] w-full rounded-lg overflow-hidden border-none'>
                <Cropper
                    image={imageURL}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={aspectRatio}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropChange={setCrop}
                    onCropComplete={cropComplete}
                />
            </div>
            <div className='flex flex-col w-full items-center pt-6 gap-2'>
                <div className='w-full flex flex-col items-center px-12'>
                    <Typography>Zoom: {zoomPercent(zoom)}</Typography>
                    <Slider
                        valueLabelDisplay='auto'
                        valueLabelFormat={zoomPercent}
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e, zoom) => setZoom(zoom)}
                    />
                </div>
                <div className='w-full flex flex-col items-center px-12'>
                    <Typography>Rotation: {rotation}</Typography>
                    <Slider
                        valueLabelDisplay='auto'
                        min={0}
                        max={360}
                        value={rotation}
                        onChange={(e, rotation) => setRotation(rotation)}
                    />
                </div>
                <div className='flex gap-3'>
                    <Button
                        onClick={() => setOpenCrop(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        onClick={handleCropImage}
                    >
                        Crop
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Crop

const zoomPercent = (value) => {
    return `${Math.round(value * 100)}%`
}