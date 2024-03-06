import { useRef } from "react";
import { IoSearch } from "react-icons/io5";


export const PhoneInput = ({ value, onChange, disabled, id }) => {
    return (
        <input
            type="tel"
            id={id}
            value={value}
            className="border bg-navy border-gray placeholder-gray-light text-white focus-visible:ring-secondary focus-visible:border-secondary focus-visible:outline-none text-sm rounded-lg block w-full p-2.5"
            placeholder="09xxxxxxxxx"
            onChange={onChange}
            disabled={disabled}
        ></input>
    )
}
export const TextInput = ({ value, onChange, onFocus, disabled, id, placeholder, type, readOnly }) => {
    return (
        <input
            id={id}
            value={value}
            className="bg-navy placeholder-white text-white read-only:focus:border-none read-only:focus-visible:border-none focus:border focus:ring-secondary focus:border-secondary focus-visible:border focus-visible:ring-secondary focus-visible:border-secondary focus-visible:outline-none text-sm rounded-2xl block w-full px-4 py-3.5"
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            type={type}
            readOnly={readOnly}
            onFocus={onFocus}
        ></input>
    )
}
export const TextareaInput = ({ value, onChange, disabled, id, placeholder, type }) => {
    return (
        <textarea
            rows={5}
            id={id}
            value={value}
            className="resize-none bg-gray-dark placeholder-white text-white focus:border focus:ring-secondary focus:border-secondary focus-visible:border focus-visible:ring-secondary focus-visible:border-secondary focus-visible:outline-none text-sm rounded-2xl block w-full px-4 py-3.5"
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            type={type}
        ></textarea>
    )
}
export const InputOutline = ({ value, onChange, onFocus, disabled, id, placeholder, type }) => {
    return (
        <input
            id={id}
            value={value}
            className="border bg-transparent border-gray-light placeholder-gray-light text-white focus-visible:ring-secondary focus-visible:border-secondary focus-visible:outline-none text-sm rounded-2xl block w-full px-4 py-3.5"
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            type={type}
            onFocus={onFocus}
        ></input>
    )
}
export const InputTransparent = ({ value, onChange, disabled, id, placeholder, type }) => {
    return (
        <input
            id={id}
            value={value}
            className="border-none bg-transparent placeholder-gray-light text-white focus-visible:outline-none text-sm rounded-2xl block w-full px-4 py-3.5"
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            type={type}
        ></input>
    )
}
export const SearchInput = ({ value, onChange, disabled, id, placeholder, type, readOnly }) => {
    return (
        <div className="relative">
            <input
                id={id}
                value={value}
                className="bg-navy placeholder-white text-white read-only:focus:border-none read-only:focus-visible:border-none focus:border focus:ring-secondary focus:border-secondary focus-visible:border focus-visible:ring-secondary focus-visible:border-secondary focus-visible:outline-none text-sm rounded-2xl block w-full px-4 pl-10 py-3.5"
                placeholder={placeholder}
                onChange={onChange}
                disabled={disabled}
                type={type}
                readOnly={readOnly}
            >
            </input>
            <IoSearch size={24} color="white" className="absolute left-3 top-3 pointer-events-none" />
        </div>
    )
}
export const ImageInput = ({ text, onChange, photoURL }) => {
    const imageInput = useRef()

    return (
        <>
            <div
                className="flex justify-between items-center bg-navy cursor-pointer text-sm rounded-2xl w-full px-4 py-3.5"
                onClick={() => imageInput.current.click()}
            >
                {text}

                {
                    photoURL &&
                    <img className="rounded-xl w-12" src={photoURL} />
                }
            </div>
            <input
                accept="image/*"
                id="nftPhoto"
                type="file"
                className="hidden"
                onChange={onChange}
                ref={imageInput}
            />
        </>
    )
}