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
import { User } from "./user-columns";
import { useMutation } from "@tanstack/react-query";
import { request2 } from "@/utils/network";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AddToTraderArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function AddToTraderArenaModal({
  isOpen,
  onClose,
  user,
}: AddToTraderArenaModalProps) {
  const [level, setLevel] = React.useState("");

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: { level: string; userId: string }) => {
      const response = await request2({
        url: `/admin/Update-Trade/${data.userId}?traders_level=${data.level}`,
        method: "PATCH",
      });
      return response;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync(
        { level, userId: user.uuid },
        {
          onSuccess: () => {
            toast.success("User added to trader arena successfully");
            queryClient.invalidateQueries({ queryKey: ["admin-students"] });
            onClose();
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to add user to trader arena");
          },
        }
      );
    } catch (error) {
      console.error("Error adding user to trader arena:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Trader Info</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Input
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Enter level"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Updating..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
