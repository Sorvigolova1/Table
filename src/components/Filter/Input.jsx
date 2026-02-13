const Input = ({ placeholder,value,onChange}) => {
    return(
        <>
            <input style={{ marginTop: '10px' }}
                placeholder={placeholder}
                value={value}
            onChange={(e) => onChange(e.target.value)}       
            />
        </>
    )

}
export default Input;