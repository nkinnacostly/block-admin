import { toast } from "sonner";

export const handleApiError = (errorResponse: any) => {
  console.log(errorResponse, "errorResponse");

  try {
    // Handle case where errorResponse is already an object (most common case)
    if (errorResponse && typeof errorResponse === "object") {
      // Check if it has a 'message' property with validation errors
      if (
        "message" in errorResponse &&
        typeof errorResponse.message === "object"
      ) {
        const messageData = errorResponse.message;

        // Handle validation errors object (e.g., { "password": ["error1", "error2"] })
        Object.keys(messageData).forEach((field) => {
          const messages = messageData[field];
          if (Array.isArray(messages)) {
            messages.forEach((message) => {
              toast.error(message);
            });
          } else if (typeof messages === "string") {
            toast.error(messages);
          }
        });
        return;
      }

      // Check if it has an 'error' property
      if ("error" in errorResponse) {
        const errorData = errorResponse.error;

        // Handle string error (e.g., { "error": "some error message" })
        if (typeof errorData === "string") {
          toast.error(errorData);
        }
        // Handle object error with nested messages (e.g., { "error": { "closing_time": ["message"] } })
        else if (typeof errorData === "object" && errorData !== null) {
          Object.keys(errorData).forEach((key) => {
            const messages = errorData[key];
            // Handle array of messages
            if (Array.isArray(messages)) {
              messages.forEach((message) => {
                toast.error(message);
              });
            }
            // Handle single string message
            else if (typeof messages === "string") {
              toast.error(messages);
            }
          });
        }
        return;
      }

      // Handle direct message property as string
      if (
        "message" in errorResponse &&
        typeof errorResponse.message === "string"
      ) {
        toast.error(errorResponse.message);
        return;
      }
    }

    // Handle case where errorResponse is a string that needs to be parsed
    if (typeof errorResponse === "string") {
      try {
        const parsed = JSON.parse(errorResponse);
        // Recursively handle the parsed object
        handleApiError(parsed);
        return;
      } catch {
        // If it's not valid JSON, treat it as a plain error message
        toast.error(errorResponse);
        return;
      }
    }

    // Fallback for unexpected formats
    toast.error("An unexpected error occurred. Please try again.");
  } catch (err) {
    console.error("Error handling API response:", err);
    toast.error("An unexpected error occurred. Please try again.");
  }
};
