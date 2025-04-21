"use client";
import { ColumnDef } from "@tanstack/react-table";
import { TraderProfile } from "../../courses/types";

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
  starting_equity: number;
  broker: string;
  login: string;
  investor_password: string;
  server_name: string;
}

export interface EditTradeProfile {
  starting_equity: number;
  broker: string;
  login: string;
  investor_password: string;
  server_name: string;
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

export const tradeColumns: ColumnDef<User>[] = [
  {
    accessorKey: "starting_equity",
    header: "Starting Equity",
  },
  {
    accessorKey: "broker",
    header: "Broker",
  },
  {
    accessorKey: "login",
    header: "Login",
  },
  {
    accessorKey: "investor_password",
    header: "Investor Password",
  },
  {
    accessorKey: "server_name",
    header: "Server Name",
  },
  {
    accessorKey: "is_reset",
    header: "Is Reset",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.trader_profile.is_reset ? "Yes" : "No"}
      </div>
    ),
  },
  {
    accessorKey: "block_path",
    header: "Block Path",
  },
  {
    accessorKey: "block_level",
    header: "Block Level",
  },
];
