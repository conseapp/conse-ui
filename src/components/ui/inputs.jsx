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