"use client";
import React from "react";
import {
  useGetSingleStudentTradeProfile,
  useGetSingleStudentTraderWinRates,
} from "../services/get-admin-student-trade-profile";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface TradeProfile {
  message: string;
  status: string;
  data: {
    id: number;
    user_id: number;
    starting_equity: string;
    broker: string;
    login: string;
    investor_password: string;
    server_name: string;
    is_reset: number;
    created_at: string;
    updated_at: string;
  };
}

function StudentTradeProfile({ id }: { id: string }) {
  const { data, isLoading, isFetching } = useGetSingleStudentTradeProfile(id);
  const {
    data: winRates,
    isLoading: winRatesLoading,
    isFetching: winRatesFetching,
  } = useGetSingleStudentTraderWinRates(id);

  const tradeProfile = data?.data as TradeProfile;

  if (isLoading || isFetching || winRatesLoading || winRatesFetching) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Trade Profile</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="py-6">
        {tradeProfile.data && Object.keys(tradeProfile.data).length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Starting Equity
                </h3>
                <Input defaultValue={tradeProfile.data.starting_equity} />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Broker
                </h3>
                <Input defaultValue={tradeProfile.data.broker} />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Login
                </h3>
                <Input defaultValue={tradeProfile.data.login} />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Investor Password
                </h3>
                <Input defaultValue={tradeProfile.data.investor_password} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 mt-3">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Server Name
                </h3>
                <Input defaultValue={tradeProfile.data.server_name} />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Win Rate
                </h3>
                <Input defaultValue={winRates?.win_rate} />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Final Equity
                </h3>
                <Input defaultValue={winRates?.equity_growth?.final_equity} />
              </div>
            </div>
          </>
        ) : (
          <div className="px-6">No data available</div>
        )}
      </CardContent>
    </Card>
  );
}

export default StudentTradeProfile;
