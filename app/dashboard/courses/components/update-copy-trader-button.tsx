"use client";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { JournalTrade } from "./journal-trade-columns";
import useFetchLevel2 from "@/hooks/useFetchLevel2";

interface UpdateCopyTraderButtonProps {
  trade: JournalTrade;
  userUuid: string;
}

export function UpdateCopyTraderButton({
  trade,
  userUuid,
}: UpdateCopyTraderButtonProps) {
  const { useMutationRequest } = useFetchLevel2();
  const queryClient = useQueryClient();
  const { mutate: updateCopyTrader, isPending } = useMutationRequest();

  const handleUpdateCopyTrader = () => {
    updateCopyTrader(
      {
        method: "PATCH",
        url: `/admin/Update-copy-trader/${userUuid}?trade_id=${trade.id}`,
      },
      {
        onSuccess: () => {
          toast.success("Copy trader settings updated successfully");
          queryClient.invalidateQueries({
            queryKey: ["journal-trades"],
          });
        },
        onError: (error) => {
          toast.error("Failed to update copy trader settings");
          console.error("Update copy trader error:", error);
        },
      }
    );
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleUpdateCopyTrader}
      disabled={isPending}
    >
      {isPending ? "Updating..." : "Update Copy Trader"}
    </Button>
  );
}
