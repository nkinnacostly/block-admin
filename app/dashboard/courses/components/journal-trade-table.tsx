"use client";
import GenericTable from "@/components/react-table";
import React, { useState } from "react";
// import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  journalTradeColumns,
  JournalTrade,
  EditJournalTrade,
} from "./journal-trade-columns";
import { GetTradesEntry } from "../services/get-trades-entry";
import useFetchLevel2 from "@/hooks/useFetchLevel2";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "../../components/user-columns";
import { EditJournalTradeModal } from "./edit-journal-trade-modal";
import { Edit2Icon } from "lucide-react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useUserStore } from "@/store/store";
import { UpdateCopyTraderButton } from "./update-copy-trader-button";

interface ApiResponse {
  data: {
    data: {
      data: User[];
    };
  };
}

function JournalTradeTable() {
  const [selectedTrade, setSelectedTrade] = useState<JournalTrade | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const { loggedInUserDetails } = useUserStore();
  const { data, error, isLoading } = GetTradesEntry() as {
    data: ApiResponse | undefined;
    error: any;
    isLoading: boolean;
  };

  const tableData = data?.data?.data.data.map((item) => item.journal_trades);
  const _data = React.useMemo(
    () =>
      tableData?.flat().map((trade) => ({
        ...trade,
        username:
          data?.data?.data.data.find((user) =>
            user.journal_trades.some((t) => t.id === trade.id)
          )?.username || "",
      })) ?? [],
    [tableData, data?.data?.data.data]
  );

  const { useMutationRequest } = useFetchLevel2();
  const queryClient = useQueryClient();
  const { mutate: updateTrade } = useMutationRequest();

  const handleEditTrade = (trade: JournalTrade) => {
    setSelectedTrade(trade);
    setIsEditModalOpen(true);
  };

  const handleSaveTrade = async (updatedTrade: JournalTrade) => {
    const editPayload: EditJournalTrade = {
      trading_pair: updatedTrade.trading_pair,
      trade_type: updatedTrade.trade_type,
      price: updatedTrade.price,
      closing_price: updatedTrade.closing_price,
      entry_time: updatedTrade.entry_time,
      closing_time: updatedTrade.closing_time,
      day_date: updatedTrade.day_date,
      result: updatedTrade.result,
      result_amount: updatedTrade.result_amount,
      setup_name: updatedTrade.setup_name,
      note: updatedTrade.note,
    };
    setIsEditLoading(true);
    updateTrade(
      {
        method: "PUT",
        url: `/admin/update-journal-trades/${loggedInUserDetails?.id}`,
        data: editPayload,
      },
      {
        onSuccess: () => {
          toast.success("Trade updated successfully");

          setIsEditModalOpen(false);
          queryClient.invalidateQueries({
            queryKey: ["journal-trades", "users-info"],
          });
        },
        onError: () => {
          toast.error("Failed to update trade");
        },
        onSettled: () => {
          setIsEditLoading(false);
        },
      }
    );
  };

  const columns = React.useMemo(() => {
    const baseColumns = journalTradeColumns.map((col) => {
      if (col.id === "actions") {
        return {
          accessorKey: "id",
          id: "actions",
          cell: ({ row }: { row: Row<JournalTrade> }) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditTrade(row.original)}
            >
              <Edit2Icon className="h-4 w-4" />
            </Button>
          ),
        } as ColumnDef<JournalTrade, unknown>;
      }
      if (col.id === "copy_trader") {
        return {
          ...col,
          cell: ({ row }: { row: Row<JournalTrade> }) => {
            // Find the parent user object that contains this trade
            const parentUser = data?.data?.data.data.find((user) =>
              user.journal_trades.some((trade) => trade.id === row.original.id)
            );

            return (
              <UpdateCopyTraderButton
                trade={row.original}
                userUuid={parentUser?.uuid || ""}
              />
            );
          },
        } as ColumnDef<JournalTrade, unknown>;
      }
      return col;
    });
    return baseColumns;
  }, [data?.data?.data.data]);

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl font-normal"> All Journal Trades</h1>
      </div>
      {error && <div className="text-red-500">{error.message}</div>}
      {isLoading && <div className="text-gray-500">Loading...</div>}
      <GenericTable
        data={_data}
        columns={columns}
        meta={{ parentData: data?.data?.data.data }}
      />
      {selectedTrade && (
        <EditJournalTradeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          trade={selectedTrade}
          onSave={handleSaveTrade}
          isLoading={isEditLoading}
        />
      )}
    </div>
  );
}

export default JournalTradeTable;
