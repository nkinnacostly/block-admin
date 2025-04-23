import useFetchLevel2 from "@/hooks/useFetchLevel2";
import { Meeting } from "../components/meeting-columns";

interface MeetingsResponse {
  message: string;
  meetings: {
    current_page: number;
    data: Meeting[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  count: number;
  status: number;
}

export function GetMeetings() {
  const { useGetRequest2 } = useFetchLevel2();
  return useGetRequest2<MeetingsResponse>("/admin/get-all-meetings", [
    "meetings",
  ]);
}
