import useFetchLevel2 from "@/hooks/useFetchLevel2";
import { Meeting } from "../components/meeting-columns";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosResponse } from "axios";

export interface ScheduleMeetingRequest {
  topic: string;
  start_time: string;
  end_time: string;
  type: string;
  zoom_meeting_id?: string;
  meeting_url?: string;
  password: string;
}

interface ScheduleMeetingResponse {
  message: string;
  meeting: Meeting;
  status: number;
}

interface ValidationError {
  [key: string]: string[];
}

interface ApiError {
  message: string;
  errors?: ValidationError;
  status: number;
}

export function useScheduleMeeting() {
  const { useMutationRequest } = useFetchLevel2();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutationRequest<
    ScheduleMeetingResponse,
    ApiError
  >();

  const handleError = (error: unknown) => {
    console.log(error);

    if (error && typeof error === "object" && "message" in error) {
      const errorObj = error as any;

      // Check if message contains validation errors (nested object structure)
      if (errorObj.message && typeof errorObj.message === "object") {
        // Handle validation errors from nested message structure
        Object.entries(errorObj.message).forEach(
          ([field, messages]: [string, any]) => {
            if (Array.isArray(messages)) {
              messages.forEach((message: string) => {
                toast.error(`${field}: ${message}`);
              });
            } else if (typeof messages === "string") {
              toast.error(`${field}: ${messages}`);
            }
          }
        );
      } else if (errorObj.errors) {
        // Handle validation errors from errors field
        Object.entries(errorObj.errors).forEach(
          ([, messages]: [string, any]) => {
            if (Array.isArray(messages)) {
              messages.forEach((message: string) => toast.error(message));
            }
          }
        );
      } else {
        // Handle general error message
        toast.error(errorObj.message || "Failed to schedule meeting");
      }
    } else {
      // Handle unknown error
      toast.error("Failed to schedule meeting");
    }
  };
  console.log(error);
  const scheduleMeeting = async (meetingData: ScheduleMeetingRequest) => {
    mutate(
      {
        url: "/admin/Schedule-meeting",
        method: "POST",
        data: {
          ...meetingData,
          message: "",
          status: 0,
        },
      },
      {
        onSuccess: (response: AxiosResponse<ScheduleMeetingResponse>) => {
          console.log(response);
          // Invalidate and refetch meetings query
          queryClient.invalidateQueries({ queryKey: ["admin-meetings"] });

          // Show success message
          toast.success(
            response.data.message || "Meeting scheduled successfully"
          );

          // Redirect to meetings page
          router.push("/dashboard/meetings");
        },
        onError: handleError,
      }
    );
  };

  return {
    scheduleMeeting,
    isPending,
    error,
  };
}
