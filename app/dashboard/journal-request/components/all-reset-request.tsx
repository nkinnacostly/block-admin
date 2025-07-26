"use client";
import React from "react";

import { useGetAllPendingResetRequest } from "../services/get-all-pending-request";
import {
  useApproveRequest,
  useRejectRequest,
} from "../services/approve-request";

import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ResetRequest {
  id: number;
  user_id: string;
  starting_equity: string;
  broker: string;
  login: string;
  investor_password: string;
  server_name: string;
  is_reset: number;
  created_at: string;
  updated_at: string;
  reason: string;
}

interface ApiResponse {
  data: {
    current_page: number;
    data: ResetRequest[];
    total: number;
  };
  status: number;
}

function AllRestJournalRequest() {
  const { data, isLoading, error, refetch } = useGetAllPendingResetRequest();
  const [approveId, setApproveId] = React.useState<string | undefined>();
  const [rejectId, setRejectId] = React.useState<string | undefined>();
  const [actionLoadingId, setActionLoadingId] = React.useState<number | null>(
    null
  );
  const queryClient = useQueryClient();

  const {
    rejectRequest,
    isPending: isRejecting,
    isSuccess: isRejected,
    error: rejectError,
  } = useRejectRequest(rejectId);

  const {
    refetch: approveRefetch,
    isSuccess: isApproved,
    isLoading: isApproving,
    error: approveError,
  } = useApproveRequest(approveId);

  const requests = data?.data as ApiResponse | undefined;

  // Approve effect
  React.useEffect(() => {
    if (approveId) {
      setActionLoadingId(Number(approveId));
      approveRefetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveId]);

  React.useEffect(() => {
    if (isApproved) {
      toast.success("Request approved successfully");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["all-pending-journal"] });
      setApproveId(undefined);
      setActionLoadingId(null);
    }
    if (approveError) {
      toast.error("Failed to approve request");
      setApproveId(undefined);
      setActionLoadingId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproved, approveError]);

  // Reject effect
  React.useEffect(() => {
    if (rejectId) {
      setActionLoadingId(Number(rejectId));
      rejectRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rejectId]);

  React.useEffect(() => {
    if (isRejected) {
      toast.success("Request declined successfully");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["all-pending-journal"] });
      setRejectId(undefined);
      setActionLoadingId(null);
      // No resetReject available, just clear state
    }
    if (rejectError) {
      toast.error("Failed to decline request");
      setRejectId(undefined);
      setActionLoadingId(null);
      // No resetReject available, just clear state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRejected, rejectError]);

  const handleApprove = (id: number) => {
    if (!isApproving && !isRejecting) {
      setApproveId(id.toString());
    }
  };

  const handleDecline = (id: number) => {
    if (!isApproving && !isRejecting) {
      setRejectId(id.toString());
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const requestList = requests?.data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Trade Profile Reset Requests</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border ">
          <thead>
            <tr className="">
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Starting Equity
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Broker
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Login
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Server
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requestList.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No requests found
                </td>
              </tr>
            ) : (
              requestList.map((request: ResetRequest) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    ${request.starting_equity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    {request.broker}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    {request.login}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    {request.server_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    {request.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      onClick={() => handleApprove(request.id)}
                      isLoading={isApproving && actionLoadingId === request.id}
                      className="hover:text-green-900 mr-4"
                      variant={"default"}
                      disabled={isApproving || isRejecting}
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleDecline(request.id)}
                      isLoading={isRejecting && actionLoadingId === request.id}
                      variant={"destructive"}
                      disabled={isApproving || isRejecting}
                    >
                      Decline
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllRestJournalRequest;
