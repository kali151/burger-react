import { useState, useEffect } from 'react';

export default client => {
    const [error, setError] = useState(null);

    const reqInterceptor = client.interceptors.request.use(req => {
        setError(null)
        return req;
    });
    const resInterceptor = client.interceptors.response.use(res => res, err => {
        setError(err);
    });

    useEffect(() => {
        // return as a cleanup func
        return () => {
            client.interceptors.request.eject(reqInterceptor);
            client.interceptors.response.eject(resInterceptor);
        };
    }, [reqInterceptor, resInterceptor]);

    const errorConfirmedHandler = () => {
        setError(null);
    };

    return [error, errorConfirmedHandler];
}