import {SearchIcon} from "lucide-react";
import type {ChangeEventHandler} from "react";

export function SearchBar({
    value,
    onChange,
    placeholder = "Search movies...",
}: {
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
}) {
    return (
        <div className="py-4">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="h-4 w-4 text-slate-400"/>
                </div>
                <input type="text" placeholder={placeholder}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/70 py-3 pl-10 text-slate-100 placeholder:text-slate-500 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
                value={value}
                onChange={onChange}
                />
            </div>
        </div>
    );
}