import type {EventData} from "../src/types"
import {API_BASE_URL, apiFetch} from "./api"

export const fetchEvents = async (): Promise<EventData[]> => {
    try {
        const response = await apiFetch(`${API_BASE_URL}/events`);

        if(!response.ok) {
            throw new Error(`APi error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
};

export const createEvent = async (event: Omit<EventData, "id" | "ownerId">
): Promise<EventData> => {
    try {
        const response = await apiFetch(`${API_BASE_URL}/events`, {
            method: "POST",
            body: JSON.stringify(event),
        });

        if(!response.ok) {
            throw new Error(`APi error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating events:", error);
        throw error;
    }
};

export const deleteEvent = async (eventId: number): Promise<void> => {
    try {
        const response = await apiFetch(`${API_BASE_URL}/events/${eventId}`, {
            method: "DELETE",
        });

        if(!response.ok) {
            throw new Error(`APi error: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error Deleting event ${eventId}:`, error);
        throw error;
    }
};

export const fetchEventById = async (eventId: number): Promise<EventData> => {
    try {
        const response = await apiFetch(`${API_BASE_URL}/events/${eventId}`, {});

        if(!response.ok) {
            throw new Error(`APi error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching event ${eventId}:`, error);
        throw error;
    }
};

export const updateEvent = async (
    eventId: number, 
    eventData: Omit<EventData, "id" | "attendees" | "ownerId">
): Promise<EventData> => {
    try {
        const response = await apiFetch(`${API_BASE_URL}/events/${eventId}`, {
            method: "PATCH",
            body: JSON.stringify(eventData),
        });

        if(!response.ok) {
            throw new Error(`APi error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error updating event ${eventId}:`, error);
        throw error;
    }
};