"use client";
import React from "react";
import { useGetSingleStudentTradeProfile } from "../services/get-admin-student-trade-profile";

function StudentTradeProfile({ id }: { id: string }) {
  const { data, isLoading, isFetching } = useGetSingleStudentTradeProfile(id);
  console.log(data);
  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }
  return <div>StudentTradeProfile</div>;
}

export default StudentTradeProfile;
