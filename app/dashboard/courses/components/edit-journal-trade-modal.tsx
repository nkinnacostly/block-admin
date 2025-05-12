"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/universal-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/text-area";
import { JournalTrade } from "./journal-trade-columns";

interface EditJournalTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trade: JournalTrade;
  // eslint-disable-next-line no-unused-vars
  onSave: (updatedTrade: JournalTrade) => void;
  isLoading: boolean;
}

export function EditJournalTradeModal({
  isOpen,
  onClose,
  trade,
  onSave,
  isLoading,
}: EditJournalTradeModalProps) {
  const [formData, setFormData] = React.useState<JournalTrade>(trade);
  console.log(formData, "formData");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Journal Trade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Trading Pair</Label>
              <Input
                value={formData.trading_pair}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, trading_pair: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Trade Type</Label>
              <Select
                value={formData.trade_type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    trade_type: value as "buy" | "sell",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Closing Price</Label>
              <Input
                type="number"
                value={formData.closing_price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    closing_price: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Entry Time</Label>
              <Input
                type="time"
                value={formData.entry_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, entry_time: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Closing Time</Label>
              <Input
                type="time"
                value={formData.closing_time}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, closing_time: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.day_date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, day_date: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Result</Label>
              <Select
                value={formData.result}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    result: value as "Profit" | "Loss" | "Breakeven",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Profit">Profit</SelectItem>
                  <SelectItem value="Loss">Loss</SelectItem>
                  <SelectItem value="Breakeven">Breakeven</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Result Amount</Label>
              <Input
                type="number"
                value={formData.result_amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    result_amount: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Setup Name</Label>
              <Input
                value={formData.setup_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, setup_name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Note</Label>
            <Textarea
              value={formData.note}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button isLoading={isLoading} type="submit" disabled={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
