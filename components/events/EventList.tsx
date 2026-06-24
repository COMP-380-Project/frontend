import {useNavigate} from "react-router-dom";
import {EventCard} from "./EventCard";
import type {EventData} from "../../src/types";
import {LoadingMessage} from "../LoadingMessage";
import {ErrorMessage} from "../ErrorMessage";

interface EventListProps {
    events: EventData[];
    loading: boolean;
    error: string | null;
}

export function EventList({
    events,
    loading = false,
    error = null,
}: EventListProps) {
    const navigate = useNavigate();
    const handleEventClick = (eventId: number) => navigate(`/events/${eventId}`);

    if (loading) return <LoadingMessage message="Loading events..." />;

    if (error) return <ErrorMessage error={error} />;

    if (events.length === 0) {
        return (<div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow">
            no events found.
        </div>
        );
    }

    return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => (
            <EventCard key={event.id} event={event} onClick={handleEventClick} />
        ))}
      </div>  
    )
}