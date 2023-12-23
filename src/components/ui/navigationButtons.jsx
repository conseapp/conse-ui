import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { GoPlus } from "react-icons/go";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom"

export const NavListButton = ({ text, path, from }) => {
    return (
        <Link state={{ from: from, backButton: true }} className='bg-navy flex justify-between items-center gap-2 p-4 rounded-2xl shadow-md' to={path}>
            {text}
            <FaAngleLeft color='#ffffff' size={20} className='pl-2' />
        </Link>
    )
}

export const NavListButtonEdit = ({ text, path, from }) => {
    return (
        <Link state={{ from: from, backButton: true }} className='bg-navy flex justify-between items-center gap-2 p-4 py-3 rounded-2xl shadow-md' to={path}>
            {text}
            <MdEdit size={32} className='pl-2 text-primary-light' />
        </Link>
    )
}

export const OutlineLinkButton = ({ text, path, from }) => {
    return (
        <Link state={{ from: from, backButton: true }} className='border border-white text-xs bg-transparent rounded-lg w-24 px-2.5 py-1.5 text-center disabled:bg-gray'
            to={path} >
            {text}
        </Link>
    )
}

export const AddButton = ({ path, from }) => {
    return (
        <Link
            state={{ from: from, backButton: true }}
            className='flex items-center justify-center p-2.5  w-14 h-14 rounded-full absolute right-0 bottom-0 text-2xl bg-secondary shadow-neon-blue-sm'
            to={path} >
            <GoPlus size={26} />
        </Link>
    )
}

// export const GoBackButton = ({ path, text }) => {
//     return (
//         <Link className='flex items-center ' to={path} >
//             <FaAngleRight color='#ffffff' size={20} className='pl-2' />
//             {text}
//         </Link>
//     )
// }