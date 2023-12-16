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