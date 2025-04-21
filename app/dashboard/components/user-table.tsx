"use client";

import React from "react";
import GenericTable from "@/components/react-table";
import { userColumns, User } from "./user-columns";
import { UserTableSkeleton } from "./user-table-skeleton";
import { useGetAdminStudents } from "../services/get-admin-students";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { AddToTraderArenaModal } from "./add-to-trader-arena-modal";

interface AdminStudentsResponse {
  data: {
    users: {
      data: User[];
    };
  };
}

export function UserTable() {
  const { data, error, isLoading } = useGetAdminStudents() as {
    data: AdminStudentsResponse | undefined;
    error: any;
    isLoading: boolean;
  };
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  console.log(error, "error");
  const _data = React.useMemo(() => data?.data?.users.data, [data]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <UserTableSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Link href="/dashboard/users/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Button>
        </Link>
      </div>
      <GenericTable data={_data ?? []} columns={userColumns(handleEditClick)} />
      {selectedUser && (
        <AddToTraderArenaModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
        />
      )}
    </div>
  );
}
