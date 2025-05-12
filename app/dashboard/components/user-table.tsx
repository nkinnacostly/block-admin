"use client";

import React from "react";
import GenericTable from "@/components/react-table";
import { userColumns, User } from "./user-columns";
import { UserTableSkeleton } from "./user-table-skeleton";
import { useGetAdminStudents } from "../services/get-admin-students";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AddToTraderArenaModal } from "./add-to-trader-arena-modal";

interface AdminStudentsResponse {
  data: {
    users: {
      data: User[];
      total: number;
    };
  };
}

export function UserTable() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const { data, isLoading, isFetching } = useGetAdminStudents(currentPage) as {
    data: AdminStudentsResponse | undefined;
    error: any;
    isLoading: boolean;
    isFetching: boolean;
  };
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const _data = React.useMemo(() => data?.data?.users.data, [data]);
  const totalUsers = data?.data?.users.total ?? 0;
  const itemsPerPage = 10; // Assuming 10 items per page, adjust as needed
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  if (isLoading || isFetching) {
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {totalUsers > 0
            ? `Page ${currentPage} of ${totalPages}`
            : "No results"}
        </div>
        <div className="space-x-2 flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

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
