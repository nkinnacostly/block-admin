"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetSingleStudentCopyTrade } from "../services/get-single-student-copy-trade";

interface CopyTradeProfile {
  message: string;
  status: string;
  data: {
    data: {
      id: number;
      copied_trade: number;
      user_id: number;
      trading_pair: string;
      trade_type: string;
      price: string;
      closing_price: string;
      entry_time: string;
      closing_time: string;
      trade_duration: string;
      day_date: string;
      result: string;
      setup_name: string;
      result_amount: string;
      note: string;
      created_at: string;
      updated_at: string;
      copy_trade: number;
      trade_status: string;
    }[];
  };
}

function StudentCopyTrade({ id }: { id: string }) {
  const { data, isLoading, isFetching } = useGetSingleStudentCopyTrade(id);

  const copyTradeProfile = data?.data as CopyTradeProfile;

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Copy Trade</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="py-6">
        {copyTradeProfile?.data?.data &&
        copyTradeProfile?.data?.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">
                Student Copy Trade Details
              </h3>
            </div>
            {copyTradeProfile.data.data.map((trade) => (
              <div
                key={trade.id}
                className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Setup Name:</span>
                      <p className="text-sm text-muted-foreground">
                        {trade.setup_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Trade Type:</span>
                      <p className="text-sm text-muted-foreground">
                        {trade.trade_type}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Entry Price:</span>
                      <p className="text-sm text-muted-foreground">
                        {trade.price}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        Closing Price:
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {trade.closing_price}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Entry Time:</span>
                      <p className="text-sm text-muted-foreground">
                        {trade.entry_time}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Closing Time:</span>
                      <p className="text-sm text-muted-foreground">
                        {trade.closing_time}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">
                        Trade Duration:
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {trade.trade_duration}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Date:</span>
                      <p className="text-sm text-muted-foreground">
                        {trade.day_date}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Result:</span>
                      <p className="text-sm text-muted-foreground">
                        {trade.result}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        Result Amount:
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {trade.result_amount}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Trade Status:</span>
                      <p className="text-sm text-muted-foreground">
                        {trade.trade_status}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Copy Trade:</span>
                      <p className="text-sm text-muted-foreground">
                        {trade.copy_trade}
                      </p>
                    </div>
                  </div>
                </div>
                {trade.note && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium">Note:</span>
                    <p className="text-sm text-muted-foreground">
                      {trade.note}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6">No data available</div>
        )}
      </CardContent>
    </Card>
  );
}

export default StudentCopyTrade;
