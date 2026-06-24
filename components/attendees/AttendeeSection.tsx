import type {User} from "../../src/types";
import {AttendeeHeader} from "./AttendeeHeader";
import {AttendeeList} from "./AttendeeList";

interface AttendeeSectionProps {
    attendees: User[];
    isOwner: boolean;
    setIsAddAttendeeModalOpen: (isOpen: boolean) => void;
    handleRemoveAttendee: (id: number) => void;
}

export function AttendeeSection({
    attendees, 
    isOwner, 
    setIsAddAttendeeModalOpen, 
    handleRemoveAttendee,
}: AttendeeSectionProps) {
    return (
        <div>
            <AttendeeHeader 
                attendees={attendees} 
                isOwner={isOwner} 
                setIsAddAttendeeModalOpen={setIsAddAttendeeModalOpen} 
            />
            <AttendeeList 
                attendees={attendees} 
                isOwner={isOwner} 
                onRemoveAttendee={handleRemoveAttendee}
            />
        </div>
    );
}