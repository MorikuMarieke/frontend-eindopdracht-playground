import './InputField.css';

export default function InputField({
                        labelText,
                        type,
                        id,
                        name,
                        className,
                        value,
                        onChange,
                        placeholder,
                        required,
                        disabled,
                        onKeyDown,
                        maxLength
                    }) {
    return (
        <>
            <label htmlFor={id}>
                {labelText}
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
                disabled={disabled}
                onKeyDown={onKeyDown}
                maxLength={maxLength}
            />
        </>
    );
};