"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, EditTradeProfile } from "./trade-colums";

interface EditTradeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: User;
  // eslint-disable-next-line no-unused-vars
  onSave: (updatedProfile: EditTradeProfile) => void;
  isLoading?: boolean;
}

export function EditTradeProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
  isLoading,
}: EditTradeProfileModalProps) {
  const [formData, setFormData] = React.useState<EditTradeProfile>({
    starting_equity: Number(profile.trader_profile.starting_equity),
    broker: profile.trader_profile.broker,
    login: profile.trader_profile.login,
    investor_password: profile.trader_profile.investor_password,
    server_name: profile.trader_profile.server_name,
    id: profile.id,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Trade Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="id"
            id="id"
            value={formData.id}
            className="hidden"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Starting Equity</Label>
              <Input
                type="number"
                value={formData.starting_equity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    starting_equity: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Broker</Label>
              <Input
                value={formData.broker}
                onChange={(e) =>
                  setFormData({ ...formData, broker: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Login</Label>
              <Input
                value={formData.login}
                onChange={(e) =>
                  setFormData({ ...formData, login: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Investor Password</Label>
              <Input
                type="password"
                value={formData.investor_password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    investor_password: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Server Name</Label>
              <Input
                value={formData.server_name}
                onChange={(e) =>
                  setFormData({ ...formData, server_name: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
