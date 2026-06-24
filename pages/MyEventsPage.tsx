import {fetchUserEvents} from "../api/attendees";
import {useAuth} from "../contexts/AuthContext";
import {EventList} from "../components/events/EventList";
import type {EventData} from "../src/types";
import {useFetch} from "../hooks/useFetch";
import {useCallback} from "react";

export function MyEventsPage() {
    const {auth} = useAuth();
    const getUserEvents = useCallback(
    () => fetchUserEvents(auth?.userId),
    [auth]
    );
    const {data, loading, error} = useFetch<EventData[]>(getUserEvents);
    const events = data ?? [];



    return (
    <>
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
                Events I'm Attending
            </h1>
        </div>

        <EventList
            loading={loading}
            error={error?.message ?? null}
            events={events}
        />
    </>
    );
}