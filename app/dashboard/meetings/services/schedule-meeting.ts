import useFetchLevel2 from "@/hooks/useFetchLevel2";
import { Meeting } from "../components/meeting-columns";

interface ScheduleMeetingResponse {
  message: string;
  meeting: Meeting;
  status: number;
}

interface ScheduleMeetingRequest {
  topic: string;
  start_time: string;
  end_time: string;
  type: string;
  zoom_meeting_id?: string;
  meeting_url?: string;
}

interface ScheduleMeetingError {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}

export function useScheduleMeeting() {
  const { useMutationRequest2 } = useFetchLevel2();
  const {
    mutate: scheduleMeeting,
    isPending,
    error,
  } = useMutationRequest2<ScheduleMeetingResponse, ScheduleMeetingError>();

  const handleScheduleMeeting = (
    data: ScheduleMeetingRequest,
    onSuccess?: () => void
  ) => {
    scheduleMeeting(
      {
        method: "POST",
        url: "/admin/Schedule-meeting",
        data: data as unknown as ScheduleMeetingError,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return {
    scheduleMeeting: handleScheduleMeeting,
    isPending,
    error,
  };
}
