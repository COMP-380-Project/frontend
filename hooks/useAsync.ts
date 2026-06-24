import {useState} from "react";

export function useAsync<Data, Params extends unknown[]>(config: {
    action: (...params: Params) => Promise<Data>;
    onSuccess?: ()=> void;
    errorMessage?: string;
}) {
    const [error, setError] = useState<Error | null>(null);

    const run = async (...params: Params) => {
        try {
            setError(null);
            await config.action(...params);
            if (config.onSuccess) {
                await config.onSuccess();
            }
        } catch (err) {
            setError(
                err instanceof Error 
                    ? err 
                    : new Error(config.errorMessage ?? "Operation failed")
            );
        }
    };

    return {run, error, setError};
}