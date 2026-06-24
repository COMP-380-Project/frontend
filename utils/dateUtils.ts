export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    if(isNaN(date.getTime())) {
       return "Invalid date format"; 
    }

    return date.toLocaleDateString(navigator.language, {
       weekday: "short",
       year: "numeric",
       month: "short",
       day: "numeric",
       hour: "2-digit",
       minute: "2-digit", 
    });
};

export const formatDateInput = (dateString: string) => {
   const date = new Date(dateString)
   if(isNaN(date.getTime())) return "";

   return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
   .toISOString()
   .slice(0, 16);
};