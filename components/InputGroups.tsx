import type { ChangeEventHandler } from "react";

interface InputGroupsProps {
    name: string;
    label: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    error?: string;
    type?: string;
    isTextArea?: boolean
    rows?: number;
    className?: string;
}

export function InputGroup({
    name,
    label,
    value,
    onChange,
    error,
    type = "text",
    isTextArea = false,
    rows = 3,
    className = "",
}: InputGroupsProps) {
    const InputType = isTextArea ? "textarea" : "input";
    return (
        
    <div className={className}>
        <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-200"
        >
            {label}
        </label>
        <InputType 
            id={name} 
            name={name} 
            value={value} 
            onChange={onChange} 
            rows={isTextArea ? rows : undefined} 
            type={isTextArea ? undefined : type}
            className={`w-full rounded-lg border bg-slate-950/70 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/30 ${
                error ? "border-rose-400" : "border-slate-700"
                }`}
        />
        {error && <p className="mt-1 text-sm text-rose-300">{error}</p>}
    </div>
    )
    

}