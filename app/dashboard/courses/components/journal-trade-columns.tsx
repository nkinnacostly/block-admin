"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import Link from "next/link";

export interface JournalTrade {
  id: number;
  trading_pair: string;
  trade_type: string;
  price: string;
  entry_time: string;
  closing_price: string;
  closing_time: string;
  trade_duration?: string;
  day_date: string;
  result: string;
  result_amount: string;
  setup_name: string;
  note?: string;
}

export interface EditJournalTrade {
  trading_pair: string;
  trade_type: string;
  price: string;
  closing_price: string;
  entry_time: string;
  closing_time: string;
  day_date: string;
  result: string;
  result_amount: string;
  setup_name: string;
  note?: string;
}

export const journalTradeColumns: ColumnDef<JournalTrade>[] = [
  {
    accessorKey: "trading_pair",
    header: "Trading Pair/Asset",
  },
  {
    accessorKey: "trade_type",
    header: "Buy/Sell",
    cell: ({ row }) => (
      <div
        className={`font-medium ${
          row.original.trade_type === "buy" ? "text-green-600" : "text-red-600"
        }`}
      >
        {row.original.trade_type}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <div className="font-medium">${row.original.price}</div>,
  },
  {
    accessorKey: "entry_time",
    header: "Entry Time",
    cell: ({ row }) => (
      <div className="font-medium">
        {/* {new Date(row.original.entry_time).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })} */}
        {row.original.entry_time}
      </div>
    ),
  },
  {
    accessorKey: "closing_price",
    header: "Closing Price",
    cell: ({ row }) => (
      <div className="font-medium">${row.original.closing_price}</div>
    ),
  },
  {
    accessorKey: "closing_time",
    header: "Closing Time",
    cell: ({ row }) => (
      <div className="font-medium">
        {/* {new Date(row.original.closing_time).toLocaleString()} */}
        {row.original.closing_time}
      </div>
    ),
  },

  {
    accessorKey: "day_date",
    header: "Date",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.day_date}</div>
    ),
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => (
      <div
        className={`font-medium ${
          row.original.result === "Profit"
            ? "text-green-600"
            : row.original.result === "Loss"
            ? "text-red-600"
            : "text-yellow-600"
        }`}
      >
        {row.original.result}
      </div>
    ),
  },
  {
    accessorKey: "result_amount",
    header: "Result Amount",
    cell: ({ row }) => (
      <div className="font-medium">${row.original.result_amount}</div>
    ),
  },
  {
    accessorKey: "setup_name",
    header: "Setup Name",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/courses/journal-trades/${row.original.id}`}>
            <Button variant="ghost" size="icon">
              <Edit2Icon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];
