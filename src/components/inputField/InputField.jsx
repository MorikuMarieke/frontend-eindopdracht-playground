import './InputField.css';

export default function InputField({
                        inputText,
                        type,
                        id,
                        name,
                        className,
                        value,
                        onChange,
                        placeholder,
                        required
                    }) {
    return (
        <>
            <label htmlFor={id}>
                {inputText}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                className={className}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </>
    );
};