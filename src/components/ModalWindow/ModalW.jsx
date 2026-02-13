import './ModalWindow.css'
const ModalW = ({ user, onClose }) => {
    const stopP = e => {
        e.stopPropagation();
    }
    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="window" onClick={stopP} >
                <img src={user.image} />
            <p>ФИО:{user.lastName} {user.firstName} {user.maidenName}</p>
                <p>Возраст:{user.age}</p>
                <p>Адрес: {
                    Object.entries(user.address)
                        .map(([key, value]) => {
                            if (key === 'coordinates') {
                                return `${key}: lat ${value.lat}, lng ${value.lng}`;
                            }
                            return `${key}: ${value}`;
                        })
                        .join(', ')
                }</p>
            <p>Рост:{user.height}</p>
                <p>Вес:{user.weight} кг</p>
                <p>Email:{user.email}</p>

        </div>
        </div>
    )

}
export default ModalW;