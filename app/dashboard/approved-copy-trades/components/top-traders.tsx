"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { AxiosResponse } from "axios";
import { useGetCopyTrades } from "../services/get-copy-trades";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request2 } from "@/utils/network";
import { toast } from "sonner";

interface Trader {
  user_id: string;
  equity: string;
  weekly_profit: number;
  one_week_gain: number;
  percentage_gain: string;
  user_name: string;
  equity_growth: number;
  status: string | number;
  win_rate: number;
  trader_level: number;
  last_trade_date: string[];
}

interface TopTradersResponse {
  message: string;
  data: Trader[];
}

interface UpdateTradeResponse {
  message: string;
  status: string | number;
}

export default function TopTraders() {
  const { data, error, isLoading } = useGetCopyTrades();
  const queryClient = useQueryClient();
  const response = data as AxiosResponse<TopTradersResponse> | undefined;
  const traders = response?.data?.data;

  const [pendingLoading, setPendingLoading] = React.useState<
    Record<string, boolean>
  >({});

  const { mutateAsync } = useMutation({
    mutationFn: async (data: { userId: string; status: "PENDING" }) => {
      const response = await request2<UpdateTradeResponse>({
        url: `/admin/update-pending-trade?user_id=${data.userId}`,
        method: "PATCH",
        data: {
          trade_status: data.status,
        },
      });
      if (response.status === 200 || response.status === 201) {
        toast.success(response.message);
        queryClient.invalidateQueries({
          queryKey: ["copy-trades-approved"],
        });
      } else {
        toast.error(response.message);
        queryClient.invalidateQueries({
          queryKey: ["copy-trades-approved"],
        });
      }
      return response;
    },
  });

  const handleUpdateStatus = async (userId: string, status: "PENDING") => {
    try {
      console.log("Setting loading for user:", userId, "to true");
      setPendingLoading((prev) => ({ ...prev, [userId]: true }));
      await mutateAsync({ userId, status });
    } finally {
      console.log("Setting loading for user:", userId, "to false");
      setPendingLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!traders?.length) return <div>No traders found</div>;

  console.log("Current pendingLoading state:", pendingLoading);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Approved Copy Traders</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="mt-3 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {traders.map((trader) => (
            <Card key={trader.user_id} className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{trader.user_name}</h3>
                  <span className="text-sm text-muted-foreground">
                    Level {trader.trader_level}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Return on Equity
                    </p>
                    <p className="text-lg font-medium">
                      {trader.equity_growth}
                    </p>
                  </div>
                  <div className="mt-2 text-right">
                    <p className="text-sm text-muted-foreground">
                      5-Day Rolling Return
                    </p>
                    <p className="text-lg font-medium ">
                      +${trader.one_week_gain}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Last Trade Date
                    </p>
                    <p className="text-lg font-medium text-green-500">
                      {trader.last_trade_date[0]}
                    </p>
                  </div>
                  <div className="mt-2 text-right">
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-lg font-medium text-green-500">
                      {trader.win_rate.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() =>
                      handleUpdateStatus(trader.user_id, "PENDING")
                    }
                    disabled={!!pendingLoading[trader.user_id]}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                  >
                    {pendingLoading[trader.user_id] ? "Removing..." : "Remove"}
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
