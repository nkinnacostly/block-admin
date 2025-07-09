"use client";

import { ColumnDef } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { TraderProfile } from "../courses/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  notification_status: number;
  email_verified_at: string;
  verification_status: string;
  user_status: string;
  block_path: string;
  block_level: number;
  phone: string;
  language: string | null;
  timezone: string | null;
  account_status: string;
  learners_level: string;
  image_url: string;
  "2FA": string;
  verification_token: string | null;
  created_at: string;
  updated_at: string;
  paid: number;
  notification_email: number;
  notification_sms: number;
  notification_push: number;
  uuid: string;
  deleted_at: string | null;
  copy_trade: number;
  has_journal: number;
  journal_trades: JournalTrade[];
  trader_profile: TraderProfile;
}

interface JournalTrade {
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
}

export const userColumns = (
  // eslint-disable-next-line no-unused-vars
  onEditClick: (user: User) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "user_status",
    header: "Status",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.user_status}</div>
    ),
  },
  {
    accessorKey: "block_path",
    header: "Block Trader Path",
    cell: ({ row }) => (
      <div className="font-medium">
        {parseInt(row.original.learners_level) > 3 ? "Trade Arena" : "Academy"}
      </div>
    ),
  },
  {
    accessorKey: "block_level",
    header: "Block Trader Level",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.learners_level}</div>
    ),
  },
  {
    accessorKey: "account_status",
    header: "Account Status",
    cell: ({ row }) => (
      <div
        className={`font-medium ${
          row.original.account_status === "Active"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {row.original.account_status}
      </div>
    ),
  },
  // {
  //   accessorKey: "learners_level",
  //   header: "Learner's Level",
  // },
  {
    accessorKey: "2FA",
    header: "2FA",
    cell: ({ row }) => (
      <div
        className={`font-medium ${
          row.original["2FA"] === "YES" ? "text-green-600" : "text-red-600"
        }`}
      >
        {row.original["2FA"]}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-2">
          <Link href={`/dashboard/${row.original.uuid}`}>
            <Edit2Icon className="h-4 w-4" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditClick(row.original)}
          ></Button>
          {/* <Edit2Icon className="h-4 w-4" /> */}
        </div>
      );
    },
  },
];
