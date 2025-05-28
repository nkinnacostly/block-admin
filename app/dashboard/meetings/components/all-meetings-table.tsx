"use client";

import React from "react";
import GenericTable from "@/components/react-table";
import { meetingColumns } from "./meeting-columns";
import { GetMeetings } from "../services/get-meetings";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

function AllMeetingsTable() {
  const { data, error, isLoading } = GetMeetings();
  console.log(data, "MEETINGS");

  const tableData = React.useMemo(
    () => data?.data?.meetings.data ?? [],
    [data?.data?.meetings.data]
  );

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl font-normal">All Meetings</h1>
        <Link
          href="/dashboard/meetings/create"
          className={`${buttonVariants({ variant: "default" })}`}
        >
          Create Meeting
        </Link>
      </div>
      {error && <div className="text-red-500">{error.message}</div>}
      {isLoading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <GenericTable data={tableData} columns={meetingColumns} />
      )}
    </div>
  );
}

export default AllMeetingsTable;
