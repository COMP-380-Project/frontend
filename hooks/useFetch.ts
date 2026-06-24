import {useState, useEffect, useCallback} from "react";

    interface UseFetchResult<T> {
        data: T | null;
        error: Error | null;
        loading: boolean;
        refetch: () => void;
    }

    export function useFetch<T>(fetcher: () => Promise<T>): UseFetchResult<T> {
        const [data, setData] = useState<T | null>(null);
        const [error, setError] = useState<Error | null>(null);
        const [loading, setLoading] = useState<boolean>(false);

        const fetchData = useCallback(async () => {
                setLoading(true);
                setError(null);
                try {
                    const result = await fetcher();
                    setData(result);
                } catch (err) {
                    setError(err as Error);
                } finally {
                    setLoading(false);
                }
            }, 
            [fetcher]
        );

        useEffect(() => {
            fetchData();
        }, [fetchData]);

        return {data, error, loading, refetch: fetchData}
    }