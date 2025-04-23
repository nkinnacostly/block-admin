"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { EditMeetingModal } from "./edit-meeting-modal";

export interface Meeting {
  id: number;
  zoom_meeting_id: string;
  type: string;
  topic: string;
  start_time: string;
  end_time: string;
  duration: string;
  join_url: string;
  created_at: string;
  updated_at: string;
}

function MeetingActions({ meeting }: { meeting: Meeting }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)}>
        <Edit2Icon className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Trash2Icon className="h-4 w-4" />
      </Button>
      <EditMeetingModal
        meeting={meeting}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </div>
  );
}

export const meetingColumns: ColumnDef<Meeting>[] = [
  {
    accessorKey: "topic",
    header: "Topic",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.type.replace("_", " ")}</div>
    ),
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.start_time), "PPP p")}</div>
    ),
  },
  {
    accessorKey: "end_time",
    header: "End Time",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.end_time), "PPP p")}</div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "join_url",
    header: "Meeting URL",
    cell: ({ row }) => (
      <a
        href={row.original.join_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Join Meeting
      </a>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <MeetingActions meeting={row.original} />,
  },
];
