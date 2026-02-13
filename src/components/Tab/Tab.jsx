import './Tab.css'
import Select from '../Select/Select';
import ModalW from '../ModalWindow/ModalW'
import Pagination from '../Pagination/pagination'
import Filter from '../Filter/Filter'
import { useEffect, useState, useRef, useMemo } from 'react'

const Tab = (props) => {
    const [limit] = useState(props.limit)
    const [users, setUsers] = useState(props.users);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);

    const [selectedSortValue, setSelectedSortValue] = useState("none");

    const columnWidthsRef = useRef({
        lastName: 150,
        firstName: 150,
        maidenName: 150,
        age: 100,
        gender: 100,
        phone: 150,
        email: 200,
        country: 150,
        city: 150
    });

    const [tableKey, setTableKey] = useState(0);

    const resizingRef = useRef({
        isResizing: false,
        currentColumn: null,
        startX: 0,
        startWidth: 0
    });

    const sortConfigRef = useRef({
        field: null,
        order: "none"
    });

    const [sortConfig, setSortConfig] = useState({
        field: null,
        order: "none"
    });

    const openModal = (user) => {
        setSelectedUser(user);
        console.log(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const fetchUsers = async (targetPage, sortField, sortOrder) => {
        setLoading(true);
        setError(null);

        const skip = (targetPage - 1) * limit;
        let url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

        const field = sortField !== undefined ? sortField : sortConfigRef.current.field;
        const order = sortOrder !== undefined ? sortOrder : sortConfigRef.current.order;

        if (field && order && order !== "none") {
            url += `&sortBy=${field}&order=${order}`;
        }

        console.log("Fetching:", url, "Page:", targetPage);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data.users);
            setPage(targetPage);
        } catch (error) {
            console.error("Ошибка при загрузке", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const sortUsers = (field) => {
        const order = selectedSortValue;
        const newConfig = { field, order };
        setSortConfig(newConfig);
        sortConfigRef.current = newConfig;
        fetchUsers(1, field, order);
    };

    const handleSortChange = (value) => {
        setSelectedSortValue(value);
    };

    const changePage = (p) => {
        fetchUsers(p, sortConfigRef.current.field, sortConfigRef.current.order);
    };

    useEffect(() => {
        fetchUsers(1, null, "none");
    }, []);

    const filteredUsers = (users) => {
        setUsers(users);
        setSelectedSortValue("none");
        sortConfigRef.current = { field: null, order: "none" };
    }

    const startResize = (e, column) => {
        e.preventDefault();
        resizingRef.current = {
            isResizing: true,
            currentColumn: column,
            startX: e.clientX,
            startWidth: columnWidthsRef.current[column]
        };

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    };

    const handleResize = (e) => {
        if (!resizingRef.current.isResizing) return;

        const { currentColumn, startX, startWidth } = resizingRef.current;
        const diff = e.clientX - startX;
        const newWidth = Math.max(50, Math.min(startWidth + diff,160));

        columnWidthsRef.current = {
            ...columnWidthsRef.current,
            [currentColumn]: newWidth
        };

        const thElements = document.querySelectorAll(`th.${currentColumn}, td.${currentColumn}`);
        thElements.forEach(el => {
            el.style.width = `${newWidth}px`;
        });
    };

    const stopResize = () => {
        resizingRef.current.isResizing = false;
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', stopResize);
        };
    }, []);

    if (loading) {
        return <h1>Loading</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    return (
        <div className="wrapper">
            <div>
                <Select
                    value={selectedSortValue}
                    onChange={handleSortChange}
                    defaultName="без сортировки"
                    options={[
                        { value: "asc", name: "по возрастанию" },
                        { value: "desc", name: "по убыванию" }
                    ]}
                />
            </div>

            <div className="table-container" style={{ overflowX: 'auto' }}>
                <table style={{ tableLayout: 'fixed', width: '100%' }}>
                    <thead>
                        <tr>
                            <th
                                className="lastName"
                                style={{ width: columnWidthsRef.current.lastName, position: 'relative' }}
                            >
                                <span onClick={() => sortUsers("lastName")}>Фамилия</span>
                                <div
                                    className="resize-handle"
                                    onMouseDown={(e) => startResize(e, 'lastName')}
                                />
                            </th>
                            <th
                                className="firstName"
                                style={{ width: columnWidthsRef.current.firstName, position: 'relative' }}
                            >
                                <span onClick={() => sortUsers("firstName")}>Имя</span>
                                <div
                                    className="resize-handle"
                                    onMouseDown={(e) => startResize(e, 'firstName')}
                                />
                            </th>
                            <th
                                className="maidenName"
                                style={{ width: columnWidthsRef.current.maidenName, position: 'relative' }}
                            >
                                <span onClick={() => sortUsers("maidenName")}>Отчество</span>
                                <div
                                    className="resize-handle"
                                    onMouseDown={(e) => startResize(e, 'maidenName')}
                                />
                            </th>
                            <th
                                className="age"
                                style={{ width: columnWidthsRef.current.age, position: 'relative' }}
                            >
                                <span onClick={() => sortUsers("age")}>Возраст</span>
                                <div
                                    className="resize-handle"
                                    onMouseDown={(e) => startResize(e, 'age')}
                                />
                            </th>
                            <th
                                className="gender"
                                style={{ width: columnWidthsRef.current.gender, position: 'relative' }}
                            >
                                <span onClick={() => sortUsers("gender")}>Пол</span>
                                <div
                                    className="resize-handle"
                                    onMouseDown={(e) => startResize(e, 'gender')}
                                />
                            </th>
                            <th
                                className="phone"
                                style={{ width: columnWidthsRef.current.phone, position: 'relative' }}
                            >
                                <span onClick={() => sortUsers("phone")}>Телефон</span>
                                <div
                                    className="resize-handle"
                                    onMouseDown={(e) => startResize(e, 'phone')}
                                />
                            </th>
                            <th
                                className="email"
                                style={{ width: columnWidthsRef.current.email, position: 'relative' }}
                            >
                                <span onClick={() => sortUsers("email")}>Email</span>
                                <div
                                    className="resize-handle"
                                    onMouseDown={(e) => startResize(e, 'email')}
                                />
                            </th>
                            <th
                                className="country"
                                style={{ width: columnWidthsRef.current.country, position: 'relative' }}
                            >
                                <span onClick={() => sortUsers("country")}>Страна</span>
                                <div
                                    className="resize-handle"
                                    onMouseDown={(e) => startResize(e, 'country')}
                                />
                            </th>
                            <th
                                className="city"
                                style={{ width: columnWidthsRef.current.city, position: 'relative' }}
                            >
                                <span onClick={() => sortUsers("city")}>Город</span>
                                <div
                                    className="resize-handle"
                                    onMouseDown={(e) => startResize(e, 'city')}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} onClick={() => openModal(user)}>
                                <td className="lastName">{user.lastName}</td>
                                <td className="firstName">{user.firstName}</td>
                                <td className="maidenName">{user.maidenName}</td>
                                <td className="age">{user.age}</td>
                                <td className="gender">{user.gender}</td>
                                <td className="phone">{user.phone}</td>
                                <td className="email">{user.email}</td>
                                <td className="country">{user.address?.country}</td>
                                <td className="city">{user.address?.city}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && selectedUser && (
                <ModalW
                    key={selectedUser.id}
                    user={selectedUser}
                    onClose={closeModal}
                />
            )}

            <Filter filterUsers={filteredUsers} />

            <div className="pagination">
                <Pagination pages={props.pagesArr} changePage={changePage} currentPage={page} />
            </div>
        </div>
    );
};

export default Tab;