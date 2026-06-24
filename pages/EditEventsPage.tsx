import {useForm} from "../hooks/useForm";
import {useNavigate, useParams} from "react-router-dom";
import {useCallback, useState, useMemo} from "react";
import {CheckIcon} from "lucide-react";
import {InputGroup} from "../components/InputGroups";
import {Button} from "../components/Button";
import {formatDateInput} from "../utils/dateUtils";
import {fetchEventById, updateEvent} from "../api/events";
import {useFetch} from "../hooks/useFetch";
import type {EventData} from "../src/types";
import {LoadingMessage} from "../components/LoadingMessage";
import {ErrorMessage} from "../components/ErrorMessage";

export function EditEventsPage() {
    const {eventId} = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const getEvent = useCallback(
        () => fetchEventById(Number(eventId)),
        [eventId]
    );

    const {
        data: currentEvent, 
        loading: isLoading, 
        error,
    } = useFetch<EventData>(getEvent);

    const initialValues = useMemo(
        () => ({
            name: currentEvent?.name || "",
            description: currentEvent?.description || "",
            date: formatDateInput(currentEvent?.date || ""),
            location: currentEvent?.location || "",
        }),
        [currentEvent]
    );

    const validate = (values: typeof initialValues) => {
        const errors: Partial<typeof initialValues> = {}
        if(values.name.length < 3) 
            errors.name = "Name must be at least 3 characters";
        if(values.description.length < 10) 
            errors.description = "Description must be at least 10 characters";
        if(!values.date) errors.date = "Date is required";
        if (values.location.length < 3)
            errors.location = "Location must be at least 3 characters";

        return errors;
    };

    const handleSubmit = async (values: typeof initialValues) => {
        if (!currentEvent?.id) return;
        setIsSubmitting(true);

        try {
            const date = new Date(values.date);
            const formattedValues = {
                ...values,
                date: date.toISOString(),
            };
            await updateEvent(currentEvent.id, formattedValues);
            navigate(`/events/${currentEvent.id}`);
        } catch (error) {
            console.error("Failed to update event:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const{
        values, 
        errors, 
        handleChange, 
        handleSubmit: onFormSubmit,
    }   = useForm({initialValues, validate, onSubmit: handleSubmit});

    if (isLoading) {
        return <LoadingMessage message="Loading event..." />;
    }

    if(error) {
        return <ErrorMessage error={error} />;
    }

    return (<div className="mx-auto my-8 flex h-[600px] w-full flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800">Edit Event</h2>
        </div>
            <div className="flex-1 overflow-y-auto p-6">
                <form id="edit-event-form" onSubmit={onFormSubmit} className="space-y-4">
                    <InputGroup 
                        name="name" 
                        label="Name" 
                        value={values.name}
                        onChange={handleChange} 
                        error={errors.name} 
                    />
                    <InputGroup 
                        name="description" 
                        label="Description" 
                        value={values.description}
                        onChange={handleChange}  
                        error={errors.description}
                        isTextArea 
                        rows={3}
                    />
                    <InputGroup 
                        name="date" 
                        label="Date and Time" 
                        value={values.date}
                        onChange={handleChange}  
                        error={errors.date}
                        type="datetime-local"
                    />
                    <InputGroup 
                        name="location" 
                        label="Location" 
                        value={values.location}
                        onChange={handleChange}  
                        error={errors.location} 
                    />
                </form>
            </div>
            <div className="flex justify-between border-t border-gray-200 p-4">
                <Button 
                    variant="secondary" 
                    type="button"
                    onClick={() => {
                        navigate(`/events/${currentEvent?.id}`);
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    form="edit-event-form"
                    type="submit"
                    icon={<CheckIcon className="mr-1 h-4 w-4" />}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
            </div>
        </div>
    );
}