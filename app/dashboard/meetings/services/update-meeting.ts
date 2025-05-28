import useFetchLevel2 from "@/hooks/useFetchLevel2";
import { Meeting } from "../components/meeting-columns";

interface UpdateMeetingResponse {
  message: string;
  meeting: Meeting;
  status: number;
}

interface UpdateMeetingError {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}

interface UpdateMeetingRequest {
  topic: string;
  start_time: string;
  end_time: string;
  type: string;
  zoom_meeting_id?: string;
  meeting_url?: string;
  password?: string;
}

export function useUpdateMeeting() {
  const { useMutationRequest } = useFetchLevel2();
  const {
    mutate: updateMeeting,
    isPending,
    error,
  } = useMutationRequest<UpdateMeetingResponse, UpdateMeetingError>();

  const handleUpdateMeeting = (
    meetingId: number,
    data: UpdateMeetingRequest,
    onSuccess?: () => void
  ) => {
    updateMeeting(
      {
        method: "PUT",
        url: `/admin/update-meeting/${meetingId}`,
        data: data as unknown as UpdateMeetingError,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return {
    updateMeeting: handleUpdateMeeting,
    isPending,
    error,
  };
}
