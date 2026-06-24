import {fetchEvents} from "../api/events";
import {EventList} from "../components/events/EventList";
import type {EventData} from "../src/types";
import {useFetch} from "../hooks/useFetch";
import {useState} from "react";
import {AddEventModal} from "../components/events/AddEventModal";
import {useAuth} from "../contexts/AuthContext";
import {Button} from "../components/Button";
import {PlusIcon} from "lucide-react";

export function EventsPage() {
    const {isAuthenticated} = useAuth();
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
    const {data, loading, error} = useFetch<EventData[]>(fetchEvents);
    const events = data ?? [];

    const handleAddEvent = () => {
    //    refetch();
       setIsAddEventModalOpen(false);
    };
 
    return (
        <>
            <div className="mb-6 flex items-center justify-between">
             <h1 className="text-2xl font-semibold text-gray-800">Events</h1>   
            <div className="flex items-center space-x-4">
                {isAuthenticated && (
                <Button onClick={() => setIsAddEventModalOpen(true)} icon={<PlusIcon className="mr-1 h-4 w-4" />}>
                    Add Event
                </Button>
            )}
            </div>
            </div>
            <EventList
            loading={loading}
            error={error?.message ?? null}
            events={events}
            />

            {isAddEventModalOpen && isAuthenticated && (
                <AddEventModal 
                isOpen={isAddEventModalOpen} 
                onClose={() => setIsAddEventModalOpen(false)} 
                onAddEvent={handleAddEvent}
                />
            )} 
        </>
    );
}