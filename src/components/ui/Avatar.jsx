import { useEffect, useState } from "react"

const Avatar = ({ color, imgPath }) => {
    const [style, setStyle] = useState('')



    useEffect(() => {
        if (color == 'blue')
            setStyle('inline-block rounded-full p-[1px] bg-gradient-to-br from-secondary from-30% to-gray to-95% drop-shadow-neon-blue-sm')

        if (color == 'pink')
            setStyle('inline-block rounded-full p-[1px] bg-gradient-to-br from-primary-light from-30% to-gray to-95% drop-shadow-neon')
    }, [color])


    return (
        <div
            className={style}
        >
            <div
                className='w-14 h-14 rounded-full bg-gray'
                style={{ backgroundImage: `url(${imgPath})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
            ></div>
        </div>
    )
}

export default Avatar