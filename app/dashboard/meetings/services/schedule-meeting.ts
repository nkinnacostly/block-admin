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
  const { useMutationRequest2 } = useFetchLevel2();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutationRequest2<
    ScheduleMeetingResponse,
    ApiError
  >();

  const handleError = (error: Error) => {
    const apiError = error as unknown as ApiError;
    if (apiError.errors) {
      // Handle validation errors
      Object.entries(apiError.errors).forEach(([, messages]) => {
        messages.forEach((message: string) => toast.error(message));
      });
    } else {
      // Handle general error
      toast.error(error.message || "Failed to schedule meeting");
    }
  };

  const scheduleMeeting = async (meetingData: ScheduleMeetingRequest) => {
    try {
      await mutate(
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
    } catch (err) {
      // Error handling is managed by the mutation's onError callback
      console.error("Schedule meeting error:", err);
    }
  };

  return {
    scheduleMeeting,
    isPending,
    error,
  };
}
