"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [copyTradeValue, setCopyTradeValue] = useState("");

  const handleUpdateCopyTrader = () => {
    if (!copyTradeValue.trim()) {
      toast.error("Please enter a copy trade value");
      return;
    }

    updateCopyTrader(
      {
        method: "PATCH",
        url: `/admin/Update-copy-trader/${userUuid}?trade_id=${trade.id}`,
        data: {
          copy_trade: copyTradeValue,
        },
      },
      {
        onSuccess: () => {
          toast.success("Copy trader settings updated successfully");
          queryClient.invalidateQueries({
            queryKey: ["journal-trades"],
          });
          setIsOpen(false);
          setCopyTradeValue("");
        },
        onError: (error) => {
          toast.error("Failed to update copy trader settings");
          console.error("Update copy trader error:", error);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update Copy Trader
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Copy Trader Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="copyTrade" className="text-right">
              Copy Trade
            </Label>
            <Input
              id="copyTrade"
              value={copyTradeValue}
              onChange={(e) => setCopyTradeValue(e.target.value)}
              placeholder="Enter copy trade value"
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setCopyTradeValue("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateCopyTrader} disabled={isPending}>
            {isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
