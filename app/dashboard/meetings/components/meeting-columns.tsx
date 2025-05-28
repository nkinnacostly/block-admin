"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { EditMeetingModal } from "./edit-meeting-modal";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useFetchLevel2 from "@/hooks/useFetchLevel2";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const queryClient = useQueryClient();
  const { useMutationRequest } = useFetchLevel2();

  const { mutate: deleteMeeting, isPending: isDeleting } = useMutationRequest();

  const handleDelete = () => {
    deleteMeeting(
      {
        url: `/admin/delete-meeting/${meeting.id}`,
        method: "DELETE",
      },
      {
        onSuccess: () => {
          toast.success("Meeting deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["admin-meetings"] });
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to delete meeting");
        },
      }
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)}>
        <Edit2Icon className="h-4 w-4" />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              meeting &ldquo;{meeting.topic}&rdquo;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
