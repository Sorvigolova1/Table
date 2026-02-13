import { useEffect, useState } from 'react'
import './pagination.css'
const Pagination = ({ currentPage, pages, changePage }) => {
    console.log(pages);
    if (!pages || pages.length === 0) {
        return null;
    }

    return (
        <>
            {pages.map(p => {
                return <span
                    key={p}
                    className={`containerPage ${currentPage === p ? 'currentPage' : ''}`}
                    onClick={() => changePage(p)}
                >
                    {p}
                </span>

            })}


        </>
    )
}
export default Pagination;