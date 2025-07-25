"use client";
import React from "react";

import { useGetAllPendingResetRequest } from "../services/get-all-pending-request";
import { useApproveRequest } from "../services/approve-request";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";

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
  const {
    refetch: approveRefetch,
    isSuccess,
    isLoading: isApproving,
  } = useApproveRequest(approveId);
  const [isDeclined, setIsDeclined] = React.useState<boolean>(false);
  const requests = data?.data as ApiResponse;

  React.useEffect(() => {
    if (approveId) {
      approveRefetch();
    }
    if (isSuccess) {
      toast.success("Request approved successfully");
      setApproveId(undefined);
    }
  }, [approveId, approveRefetch, refetch, isSuccess]);

  const handleApprove = async (id: number) => {
    setApproveId(id.toString());
  };

  const handleDecline = async (id: number) => {
    try {
      setIsDeclined(true);
      await axios.post(
        `https://block-traders.com.blocktraders.academy/api/admin/decline-reset-profile/${id}`,
      );
      refetch(); // Refresh the list
    } catch (error) {
      console.error("Error declining request:", error);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Trade Profile Reset Requests</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full  border ">
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
          {requests.data.data?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No requests found
            </div>
          ) : (
            <tbody className="divide-y divide-gray-200">
              {requests.data.data?.map((request: ResetRequest) => (
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
                      isLoading={isApproving}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleDecline(request.id)}
                      isLoading={isDeclined}
                      className="text-red-600 hover:text-red-900"
                    >
                      Decline
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}

export default AllRestJournalRequest;
