import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

export function useForm<T>({
    initialValues,
    validate,
    onSubmit,

}: {
    initialValues: T;
    validate?: (values: T) => Partial<T>;
    onSubmit: (values: T) => Promise<void> | void;
}) {
    const[values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<T>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>  
    ) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value}));
        setErrors((prev) => {
            const next = { ...prev };
            delete next[name as keyof T];
            return next;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (validate) {
            const newErrors = validate(values);
            setErrors(newErrors);


            if(Object.keys(newErrors).length) {
                return;
            }
        }

        setIsLoading(true);
        try {
            await onSubmit(values);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Something went wrong"));
        } finally {
            setIsLoading(false);
        }
    };

    const reset =() => {
        setValues(initialValues);
        setErrors({});
        setError(null);        
    };

    return {
        values,
        errors,
        error,
        isLoading,
        handleChange,
        handleSubmit,
        reset
    }
}