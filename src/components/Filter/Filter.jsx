import Input from './Input'
import { useEffect, useMemo, useState } from 'react'

const Filter = (props) => {
    const [filters, setFilters] = useState({
        lastName: '',
        firstName: '',
        maidenName: '',
        age: '',
        gender: '',
        email: '',
        country: '',
        city: ''
    });
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const filterUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://dummyjson.com/users');
            const data = await response.json();
            console.log(data);

            const filtered = data.users.filter(user => {
                if (filters.lastName && !user.lastName?.toLowerCase().includes(filters.lastName.toLowerCase())) {
                    return false;
                }

                if (filters.firstName && !user.firstName?.toLowerCase().includes(filters.firstName.toLowerCase())) {
                    return false;
                }

                if (filters.maidenName && !user.maidenName?.toLowerCase().includes(filters.maidenName.toLowerCase())) {
                    return false;
                }

                if (filters.age) {
                    const ageNum = parseInt(filters.age);
                    if (!isNaN(ageNum) && user.age !== ageNum) {
                        return false;
                    }
                }

                if (filters.gender && user.gender?.toLowerCase() !== filters.gender.toLowerCase()) {
                    return false;
                }

                if (filters.email && !user.email?.toLowerCase().includes(filters.email.toLowerCase())) {
                    return false;
                }

                if (filters.country && !user.address?.country?.toLowerCase().includes(filters.country.toLowerCase())) {
                    return false;
                }

                if (filters.city && !user.address?.city?.toLowerCase().includes(filters.city.toLowerCase())) {
                    return false;
                }

                return true;
            });

            setFilteredUsers(filtered);
            console.log('Найдено пользователей:', filtered.length);
            console.log('Отфильтрованные пользователи:', filtered);
            props.filteredUsers(filtered);

        } catch (error) {
            console.error('Ошибка при фильтрации:', error);
        } finally {
            setLoading(false);
        }


    }
    return(

    <>
     <Input 
                  placeholder="Фамилия" 
                value={filters.lastName}
                onChange={(val) => handleFilterChange('lastName', val)}
                />
            <Input 
                    placeholder="Имя" 
                value={filters.firstName}
                onChange={(val) => handleFilterChange('firstName', val)}
                />
            <Input 
                    placeholder="Отчество" 
                value={filters.maidenName}
                onChange={(val) => handleFilterChange('maidenName', val)}
                />
            <Input 
                    placeholder="Возраст" 
                    type="number"
                value={filters.age}
                onChange={(val) => handleFilterChange('age', val)}
                />
            <Input 
                    placeholder="Пол (male/female)" 
                value={filters.gender}
                onChange={(val) => handleFilterChange('gender', val)}
                />
            <Input 
                    placeholder="Email" 
                value={filters.email}
                onChange={(val) => handleFilterChange('email', val)}
                />
            <Input 
                    placeholder="Страна" 
                value={filters.country}
                onChange={(val) => handleFilterChange('country', val)}
                />
            <Input 
                   placeholder="Город" 
                value={filters.city}
                onChange={(val) => handleFilterChange('city', val)}
        />
            <button onClick={() => filterUsers()}>Выполнить фильтрацию</button>
        </>
                )

}
export default Filter;