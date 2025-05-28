"use client";
import React from "react";
import { useGetSingleStudentProfile } from "../services/get-single-students-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { User } from "./user-columns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface userResponse {
  message: string;
  user: User;
}

function StudentProfileComponent({ id }: { id: string }) {
  const { data, isLoading, isFetching } = useGetSingleStudentProfile(id);
  const userData = data?.data as userResponse | undefined;
  console.log(userData);

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
              <Input defaultValue={userData?.user.first_name} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Last Name
              </h3>
              <Input defaultValue={userData?.user.last_name} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                User Name
              </h3>
              <Input defaultValue={userData?.user.username} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                User Status
              </h3>
              <Input defaultValue={userData?.user.user_status} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <Input defaultValue={userData?.user.email} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Phone
              </h3>
              <Input defaultValue={userData?.user.phone} />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                User Role
              </h3>
              <Badge
                variant={
                  userData?.user.user_status === "active"
                    ? "success"
                    : "secondary"
                }
              >
                {userData?.user.user_status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentProfileComponent;
