import { useEffect } from 'react';
import axios from 'axios';

const useGetData = (url, user, setData) => {
    useEffect(() => {
        if (user && user.cargo) {
            axios.get(url)
                .then(response => {
                    if (user.cargo === 'admin') {
                        setData(response.data);
                    } else if (user.cargo === 'gerente' || user.cargo === 'funcionario') {
                        const filteredData = response.data.filter(item => item.id_barbearia === user.id_barbearia);
                        setData(filteredData);
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar dados:', error);
                });
        }
    }, [user, url, setData]);
};

export default useGetData;
