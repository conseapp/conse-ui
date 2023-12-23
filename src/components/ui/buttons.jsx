import { FaAngleRight } from "react-icons/fa6"
import { IoMdClose } from "react-icons/io"


export const SubmitButton = ({ text, disabled, id }) => {
    return (
        <button
            className='bg-primary-light rounded-lg shadow-neon w-full px-2 py-2.5 text-center active:bg-primary active:shadow-none transition disabled:bg-gray disabled:text-gray-light disabled:shadow-none'
            type={"submit"}
            id={id}
            disabled={disabled}
        >
            {text}
        </button>
    )
}

export const RegularButton = ({ text, disabled, id, onClick }) => {
    return (
        <button
            className='bg-primary-light rounded-lg shadow-neon w-full px-2 py-2.5 text-center active:bg-primary active:shadow-none transition disabled:bg-gray disabled:text-gray-light disabled:shadow-none'
            type={"button"}
            id={id}
            disabled={disabled}
            onClick={onClick}
        >
            {text}
        </button>
    )
}
export const OutlineButton = ({ text, disabled, id, onClick }) => {
    return (
        <button
            className='border border-white bg-transparent rounded-lg w-full px-2 py-2.5 text-center disabled:text-gray-light'
            type={"button"}
            id={id}
            disabled={disabled}
            onClick={onClick}
        >
            {text}
        </button>
    )
}
export const CancelButton = ({ text, disabled, id, onClick }) => {
    return (
        <button
            className='flex gap-2 border-none bg-transparent text-primary-light rounded-lg w-full px-2 py-2.5 text-center disabled:text-gray-light'
            type={"button"}
            id={id}
            disabled={disabled}
            onClick={onClick}
        >
            <IoMdClose size={20} />
            {text}
        </button>
    )
}

export const GoBackButton = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className='flex items-center' >
            <FaAngleRight color='#ffffff' size={20} className='pl-2' />
            {text}
        </button>
    )
}