import type {EventData, User} from "../src/types";
import {API_BASE_URL, apiFetch} from "./api";

export const fetchUserEvents = async (userId: number | undefined): Promise<EventData[]> => {
    if (!userId) {
        return [];
    }

    try {
        const response = await apiFetch(
            `${API_BASE_URL}/attendees/${userId}/events`
        );

        if(!response.ok) {
           throw new Error(`Api error: ${response.status}`) 
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching events for user ${userId}:`, error)
        throw error;
    }
};

export const fetchEventAttendees = async (eventId: number): Promise<User[]> => {
    try {
        const response = await apiFetch(    
            `${API_BASE_URL}/events/${eventId}/attendees`
        );

        if(!response.ok) {
           throw new Error(`Api error: ${response.status}`) 
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching attendees for event ${eventId}:`, error)
        throw error;
    }
};

export const addAttendeeToEvent = async (
    eventId: number, 
    userId: number
): Promise<void> => {
    try {
        const response = await apiFetch(
            `${API_BASE_URL}/events/${eventId}/attendees/${userId}`,
            {method: "POST"}
        );

        if(!response.ok) {
           throw new Error(`Api error: ${response.status}`) 
        }

    } catch (error) {
        console.error(`Error adding attendee ${userId} to event ${eventId}:`, error)
        throw error;
    }
};

export const removeAttendeeFromEvent = async (
    eventId: number, 
    userId: number
): Promise<void> => {
    try {
        const response = await apiFetch(
            `${API_BASE_URL}/events/${eventId}/attendees/${userId}`,
            {method: "DELETE"}
        );

        if(!response.ok) {
           throw new Error(`Api error: ${response.status}`) 
        }

    } catch (error) {
        console.error(`Error removing attendee ${userId} from event ${eventId}:`, error)
        throw error;
    }
};