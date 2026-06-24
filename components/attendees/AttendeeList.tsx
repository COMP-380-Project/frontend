import type {User} from "../../src/types";
import {XIcon, CheckIcon} from "lucide-react";
import {Button} from "../Button";
import clsx from "clsx";

interface AttendeelistProps {
    attendees: User[];
    mode?: "display" | "selection";
    isOwner?: boolean;
    selectedAttendee?: User | null;
    onAttendeeSelect?: (attendee: User) => void;
    onRemoveAttendee?: (id: number) => void;
}

export function AttendeeList({
    attendees = [],
    mode = "display",
    isOwner,
    selectedAttendee,
    onAttendeeSelect = () => {},
    onRemoveAttendee = () => {},
}: AttendeelistProps) {
    if(attendees.length === 0) 
        return null;

    return (    
        <div>
            <ul className="h-full divide-y divide-gray-200 pb-6">
               {attendees.map(({id, name, email}) => (
                <li 
                    key={id} 
                    className={clsx(
                        "group flex items-center justify-between py-4 hover:bg-gray-50",
                        mode === "selection" && selectedAttendee?.id === id
                            ? "cursor-pointer bg-blue-50"
                            : ""
                    )}
                onClick={() => 
                    mode === "selection" && onAttendeeSelect({id, name, email})
                } 
                >
                 <div>
                    <p className="font-medium text-gray-800">{name}</p>
                    <p className="text-sm text-gray-600">{email}</p>
                 </div>
                 {mode === "display" && isOwner && onRemoveAttendee && (
                    <Button 
                        size="small"
                        variant="secondary"
                        className="mr-4 cursor-pointer rounded-full p-1.5 opacity-0 hover:bg-red-50 group-hover:opacity-100"
                        onClick={() => onRemoveAttendee(id)}
                    >
                       <XIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    </Button>
                 )}
                 {mode === "selection" && selectedAttendee?.id === id && (
                    <CheckIcon className="mr-4 h-5 w-5 text-blue-600" />
                 )}  
                </li>
               ))} 
            </ul>
        </div>
    );
}

