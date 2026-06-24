import {formatDate} from "../../utils/dateUtils";
import {MapPinIcon, CalendarIcon} from "lucide-react";
import type {EventData} from "../../src/types";

interface EventCardProps {
    event: EventData;
    onClick: (eventId: number) => void;
}

export function EventCard({event, onClick}: EventCardProps) {
    return (
        <div 
            onClick={() => onClick(event.id)} 
            className="flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow transition-shadow duration-300 hover:shadow-md"
        >
            <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 text-lg font-medium text-gray-800">{event.name} </h3>
                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                    {event.description}
                </p>
                <div className="mb-2 flex items-center text-sm text-gray-500">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <p>{formatDate(event.date)}</p>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    <p>{event.location}</p>
                </div>
            </div>
        </div>
    );
}