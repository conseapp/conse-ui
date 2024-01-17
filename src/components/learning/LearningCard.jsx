import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getRoleImg } from '../../api/rolesApi'
import { useInView } from 'react-intersection-observer';


const LearningCard = ({ card, type }) => {
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

    useEffect(() => {
        if (inView) {
            handleGetRoleImg()
        }

    }, [inView])



    return (
        (type == 'modern-role') ?
            <div ref={ref} className='relative w-full h-full flex flex-col justify-end'>
                <div className='flex-1 overflow-hidden relative'>
                    <img className='w-full' src={roleImg} />
                    <div className="absolute z-10 w-full h-full left-0 bottom-0 bg-gradient-to-b from-transparent from-40% to-gray-dark to-90%"></div>
                </div>
                <span className='text-sm p-3'>{card.name}</span>
            </div>
            :
            <div ref={ref} className='relative w-full h-full flex flex-col justify-end'>
                <div className='flex-1 overflow-hidden relative'>
                    < img className='w-full' src={roleImg} />
                    <div className="absolute z-10 w-full h-full left-0 bottom-0 bg-gradient-to-b from-transparent from-40% to-gray-dark to-90%"></div>
                </div>
                <span className='text-sm p-3'>{card.name.replace('cp/', '')}</span>
            </div>
    )
}

export default LearningCard