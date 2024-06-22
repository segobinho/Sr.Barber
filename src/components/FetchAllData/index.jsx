import { useState, useEffect } from 'react';

const useFetchServices = (url) => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setServices(data);
                setFilteredServices(data);
            });
    }, [url]);

    return { services, setServices, filteredServices, setFilteredServices };
};

export default useFetchServices;
