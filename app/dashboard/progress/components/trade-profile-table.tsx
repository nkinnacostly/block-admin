"use client";
import GenericTable from "@/components/react-table";
import React, { useState } from "react";
import { tradeColumns, User, EditTradeProfile } from "./trade-colums";
import { useGetAllProfileTrades } from "../services/get-trade-statistics";
import { EditTradeProfileModal } from "./edit-trade-profile-modal";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { ColumnDef, Row } from "@tanstack/react-table";
import useFetchLevel2 from "@/hooks/useFetchLevel2";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/store";

interface ApiResponse {
  data: {
    data: {
      data: User[];
    };
  };
}

function TradeProfileTable() {
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const { loggedInUserDetails } = useUserStore();

  const { data } = useGetAllProfileTrades() as {
    data: ApiResponse | undefined;
    error: any;
    isLoading: boolean;
  };
  const _data = React.useMemo(() => data?.data?.data.data ?? [], [data]);

  const { useMutationRequest } = useFetchLevel2();
  const queryClient = useQueryClient();
  const { mutate: updateProfile } = useMutationRequest();

  const handleEditProfile = (profile: User) => {
    setSelectedProfile(profile);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (updatedProfile: EditTradeProfile) => {
    setIsEditLoading(true);
    updateProfile(
      {
        method: "PUT",
        url: `/admin/update-trade-profile/${loggedInUserDetails?.id}`,
        data: updatedProfile,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          setIsEditModalOpen(false);
          queryClient.invalidateQueries({
            queryKey: ["trade-profile"],
          });
        },
        onError: () => {
          toast.error("Failed to update profile");
        },
        onSettled: () => {
          setIsEditLoading(false);
        },
      }
    );
  };

  const columns = React.useMemo(() => {
    const baseColumns = tradeColumns.map((col) => {
      if (col.id === "actions") {
        return {
          accessorKey: "id",
          id: "actions",
          cell: ({ row }: { row: Row<User> }) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditProfile(row.original)}
            >
              <Edit2Icon className="h-4 w-4" />
            </Button>
          ),
        } as ColumnDef<User, unknown>;
      }
      return col;
    });
    return baseColumns;
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-xl font-normal"> All Trade Profile</h1>
      </div>
      <GenericTable data={_data} columns={columns} />
      {selectedProfile && (
        <EditTradeProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={selectedProfile}
          onSave={handleSaveProfile}
          isLoading={isEditLoading}
        />
      )}
    </div>
  );
}

export default TradeProfileTable;
