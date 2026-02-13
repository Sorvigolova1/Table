import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Tab from './components/Tab/Tab'
function App() {
    const [limit, setLimit] = useState(10);
    const [fetchedData, setFetchedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const pagesArr = useMemo(() => {
        const arr = [];
        for (let i = 0; i < totalPages; i++) arr.push(i + 1);
        return arr;
    }, [totalPages])
    useEffect(() => {
        setLoading(true);
        fetch(`https://dummyjson.com/users?limit=10`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setTotalPages(Math.ceil(data.total / limit));
                setFetchedData(data.users);
                setLoading(false);
            })
            .catch(err => {
                console.error('Ошибка при загрузке:', err);
                setError(err.message);
                setLoading(false);
            });
      
    }, []);
    
   

    return (

        <>
            {
                loading ? (
                    <h1>Loading</h1>
                ) : error ? (
                    <h1>{error}</h1>
                ) : (
                    <Tab users={fetchedData} pagesArr={pagesArr} limit={limit} />
                )
            }
     
    </>
  )
}

export default App
