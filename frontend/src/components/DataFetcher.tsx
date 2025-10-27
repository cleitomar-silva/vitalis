import axios from "axios";
import {useEffect, useState} from "react";
import {apiBaseUrl} from "../config";
import Cookies from "js-cookie";

const DataFetcher = () => {

    // TODO


    const tokenGet = Cookies.get('auth_token_vitalis');    

    const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState([]);
    const [currentPage, setCurrentPage ] = useState(0);
    useEffect(() => {
        const fetchData = async () =>{
            const page = Math.min(currentPage + 1, totalPages);
            // const result = await axios.get(`${API_URL}?&page=${page}`);

            const result = await axios.get(`${apiBaseUrl}/users/search?por_pagina=10&pagina=${page}&search=${searchTerm}`, {
                headers: {
                    'x-access-token': `${tokenGet}`
                },
            });

            setPages(result.data.lista);
            setTotalPages(result.data.totalPaginas);
            setLoading(false);

             console.log(result);
        };
        fetchData();
    }, [currentPage]);

    return {
        loading,
        pages,
        setPages,
        totalPages,
        setTotalPages,
        currentPage,
        setCurrentPage,
        setSearchTerm,
        searchTerm
    }
}

export default DataFetcher;
