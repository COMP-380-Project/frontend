import {PlusIcon} from "lucide-react";
import type {User} from "../../src/types";
import {Button} from "../Button";

interface AttendeeHeaderProps {
    attendees: User[];
    isOwner: boolean;
    setIsAddAttendeeModalOpen: (isOpen: boolean) => void;
}

export function AttendeeHeader({
    attendees,
    isOwner,
    setIsAddAttendeeModalOpen,
}: AttendeeHeaderProps) {
    return (<div className="mb-1 flex items-center justify-between">
       <h3 className="text-lg font-medium text-gray-800">
        {attendees.length > 0 ? "Attendees" : "No attendees yet"}{""}
        <span className="text-sm text-gray-500">({attendees.length})</span>
       </h3> 
       {isOwner && (
        <Button 
            variant="secondary" 
            size="small" 
            icon={<PlusIcon className="h-4 w-4" />}
            onClick={() => setIsAddAttendeeModalOpen(true)}
            >
                Add Attendee
            </Button>
        )}
    </div>)
}