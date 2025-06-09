"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { AxiosResponse } from "axios";
import { useGetCopyTrades } from "../services/get-copy-trades";
import { useMutation } from "@tanstack/react-query";
import { request2 } from "@/utils/network";

interface Trader {
  user_id: string;
  starting_equity: string;
  weekly_profit: number;
  profit_gain: number;
  percentage_gain: string;
  equity_growth: number;
}

interface TopTradersResponse {
  message: string;
  data: Trader[];
}

export default function TopTraders() {
  const { data, error, isLoading } = useGetCopyTrades();
  const response = data as AxiosResponse<TopTradersResponse> | undefined;
  const traders = response?.data?.data;
  const [approveLoading, setApproveLoading] = React.useState<
    Record<string, boolean>
  >({});
  const [declineLoading, setDeclineLoading] = React.useState<
    Record<string, boolean>
  >({});

  const { mutateAsync } = useMutation({
    mutationFn: async (data: {
      userId: string;
      status: "APPROVED" | "DECLINE";
    }) => {
      const response = await request2({
        url: `/admin/update-pending-trade?user_id=${data.userId}`,
        method: "PATCH",
        data: {
          trade_status: data.status,
        },
      });

      return response;
    },
  });

  const handleUpdateStatus = async (
    userId: string,
    status: "APPROVED" | "DECLINE"
  ) => {
    if (status === "APPROVED") {
      setApproveLoading((prev) => ({ ...prev, [userId]: true }));
    } else {
      setDeclineLoading((prev) => ({ ...prev, [userId]: true }));
    }

    try {
      await mutateAsync({ userId, status });
    } finally {
      if (status === "APPROVED") {
        setApproveLoading((prev) => ({ ...prev, [userId]: false }));
      } else {
        setDeclineLoading((prev) => ({ ...prev, [userId]: false }));
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!traders?.length) return <div>No traders found</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top Traders</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-3 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {traders.map((trader) => (
            <Card key={trader.user_id} className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{trader.user_id}</h3>
                  <span className="text-sm text-muted-foreground">
                    Level {trader.weekly_profit}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Equity</p>
                    <p className="text-lg font-medium">
                      ${trader.starting_equity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">1 Week Gain</p>
                    <p className="text-lg font-medium ">
                      +${trader.profit_gain}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Performance</p>
                  <p className="text-lg font-medium ">
                    +{trader.percentage_gain}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() =>
                      handleUpdateStatus(trader.user_id, "APPROVED")
                    }
                    disabled={approveLoading[trader.user_id]}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {approveLoading[trader.user_id] ? "Loading..." : "Approve"}
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(trader.user_id, "DECLINE")
                    }
                    disabled={declineLoading[trader.user_id]}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {declineLoading[trader.user_id] ? "Loading..." : "Decline"}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
