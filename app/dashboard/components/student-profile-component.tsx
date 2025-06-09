"use client";
import React, { useState } from "react";
import { useGetSingleStudentProfile } from "../services/get-single-students-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { User } from "./user-columns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AddToTraderArenaModal } from "./add-to-trader-arena-modal";

interface userResponse {
  message: string;
  data: User;
}

function StudentProfileComponent({ id }: { id: string }) {
  const { data, isLoading, isFetching } = useGetSingleStudentProfile(id);
  const userData = data?.data as userResponse | undefined;
  const [open, setOpen] = useState(false);

  if (isLoading || isFetching) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (!userData) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>Upgrade User</Button>
        <AddToTraderArenaModal
          isOpen={open}
          onClose={() => setOpen(false)}
          user={userData?.data}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                First Name
              </h3>
              <Input defaultValue={userData?.data.first_name} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Last Name
              </h3>
              <Input defaultValue={userData?.data.last_name} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                User Name
              </h3>
              <Input defaultValue={userData?.data.username} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                User Status
              </h3>
              <Input defaultValue={userData?.data.user_status} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <Input defaultValue={userData?.data.email} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Phone
              </h3>
              <Input defaultValue={userData?.data.phone} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                User Role
              </h3>
              <Badge
                variant={
                  userData?.data.user_status === "active"
                    ? "success"
                    : "secondary"
                }
              >
                {userData?.data.user_status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentProfileComponent;
