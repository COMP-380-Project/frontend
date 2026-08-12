import {useState} from "react";

export function useAsync<Data, Params extends unknown[]>(config: {
    action: (...params: Params) => Promise<Data>;
    onSuccess?: (data: Data) => void;
    errorMessage?: string;
}) {
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);

    const run = async (...params: Params) => {
        try {
            setLoading(true);
            setError(null);

            const result = await config.action(...params);

            if (config.onSuccess) {
                config.onSuccess(result);
            }

            return result;

        } catch (err) {

            setError(
                err instanceof Error
                    ? err
                    : new Error(
                        config.errorMessage ?? "Operation failed"
                    )
            );

        } finally {
            setLoading(false);
        }
    };

    return {
        run,
        error,
        setError,
        loading
    };
}