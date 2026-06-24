import {SearchIcon} from "lucide-react";
import type {ChangeEventHandler} from "react";

export function SearchBar({
    value,
    onChange,
}: {
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}) {
    return (
        <div className="border-b border-gray-200 py-4">
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="h-4 w-4 text-gray-400"/>
                </div>
                <input type="text" placeholder="Search users..."
                className="w-full rounded-md border border-gray-300 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={onChange}
                />
            </div>
        </div>
    );
}