import { forwardRef } from 'react';

const Select = ({ value, onChange, defaultName, options }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="none">{defaultName}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>
    );
};

export default Select;