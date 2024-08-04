import { useState, useEffect } from "react";
import apiClient from "../services/api-client";

export interface Genre {
    id: number,
    name: string,
    slug: string
}

interface FetchGenreResponse {
    count: number,
    results: Genre[]
};

const useGenres = () => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        apiClient.get<FetchGenreResponse>('/genres', { signal: controller.signal })
            .then((resp) => {
                setGenres(resp.data.results);
                setLoading(false);
            })
            .catch((error) => {
                if (error.message !== 'canceled')
                    setError(error.message);
                setLoading(false);
            })
        return () => controller.abort();
    }, []);

    return { genres, error, isLoading };
}

export default useGenres;