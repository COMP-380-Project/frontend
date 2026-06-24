import {XIcon} from "lucide-react";
import {createEvent} from "../../api/events";
import type {EventData} from "../../src/types";
import {InputGroup} from "../InputGroups";
import {Button} from "../Button";
import {useForm} from "../../hooks/useForm";

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddEvent: (event: EventData) => void;
}

interface EventFormData {
    name: string;
    description: string;
    date: string;
    location: string;
}

const initialValues: EventFormData = {
    name: "",
    description: "",
    date: "",
    location: "",
};

export function AddEventModal({
    isOpen, 
    onClose, 
    onAddEvent,
}: AddEventModalProps) {
   const validate = (values: EventFormData) => {
    const errors: Partial<EventFormData> = {}
    if(values.name.length < 3)
        errors.name = "Name must be at least 3 charachters";
    if(values.description.length < 10)
        errors.description = "Description must be at least 10 characters";
    if(!values.date) errors.date = "Date is required";
    if (values.location.length < 3)
        errors.location = "Location must be at least 3 characters";
    return errors;
   };

   const onSubmit = async (values: EventFormData) => {
    const date = new Date(values.date);
    const formattedValues = {
        ...values,
        date: date.toISOString(),
    };
    const newEvent = await createEvent(formattedValues);
    onAddEvent(newEvent);
    reset();
    onClose();
   };

   const { values, errors, isLoading, handleChange, handleSubmit, reset} = 
   useForm({ initialValues, validate, onSubmit});

   if (!isOpen) return null;

   return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4">
        <div onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md rounded-lg bg-white shadow-lg"
        >
         <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800">Add New Event</h2>
            <Button variant="secondary" onClick={onClose}>
                <XIcon className="h-5 w-5" />
            </Button>
         </div>   
        <form onSubmit={handleSubmit} className="p-4">
            <div className="space-y-4">
                <InputGroup
                 name="name" 
                 label="Name" 
                 value={values.name} 
                 onChange={handleChange} 
                 error={errors.name}
                 isTextArea
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
                 isTextArea
                />
            </div>
            <div className="mt-6 flex justify-end space-x-2">
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Event"}
                </Button>
            </div>
        </form>
        </div>
    </div>
   )
}