"use client";

import React, { useEffect } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import useGetUserInfo from "@/hooks/useGetUserInfo";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { settingSchema } from "@/schemas/settings";
import { useUpdateUserInfo } from "../service/update-user-info-service";

type SettingFormData = z.infer<typeof settingSchema>;

export default function UsersInfo() {
  const { loggedInUserDetails } = useUserStore();
  const { mutateAsync, isPending } = useUpdateUserInfo();
  const { error } = useGetUserInfo();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm<SettingFormData>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      id: loggedInUserDetails?.id ? loggedInUserDetails.id : undefined,
      email: loggedInUserDetails?.email,
    },
  });

  useEffect(() => {
    if (loggedInUserDetails) {
      reset({
        first_name: loggedInUserDetails.first_name,
        last_name: loggedInUserDetails.last_name,
        phone: loggedInUserDetails.phone,
        email: loggedInUserDetails?.email,
        id: loggedInUserDetails?.id ? loggedInUserDetails.id : undefined,
      });
    }
  }, [loggedInUserDetails, reset]);

  const onSubmit = async (userData: SettingFormData) => {
    try {
      const response = await mutateAsync(userData);
      if (response) {
        toast.success(`User Profile Updated`);
        queryClient.invalidateQueries({ queryKey: [' "users-info"'] });
      }
    } catch (error: any) {
      console.error("Login failed:", error.error);
      toast.error(`${error.error}`);
    }
  };

  if (error) return <>{toast.error("Something Went Wrong")}</>;
  console.log("errors", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-start justify-start w-full lg:w-[534px] p-5 space-y-5 shadow-xl rounded-xl border-2">
        <p className="text-xl font-medium mt-[2rem] text-start">
          User Information
        </p>
        <div className="flex items-start flex-col lg:flex-row justify-between w-full p-4 space-y-3 lg:space-y-0 lg:space-x-3 border-b-2">
          <div>
            <p>First Name</p>
            <Input
              {...register("first_name")}
              // error={errors.first_name}
              type="text"
              defaultValue={loggedInUserDetails?.first_name}
              placeholder="First Name"
            />
          </div>
          <div>
            <p>Last Name</p>
            <Input
              {...register("last_name")}
              // error={errors.last_name}
              type="text"
              placeholder="Last Name"
              defaultValue={loggedInUserDetails?.last_name}
            />
          </div>
        </div>
        <div className="w-full p-4 border-b-2 ">
          <p>Email Address</p>
          <Input
            {...register("email")}
            // error={errors.email}
            type="email"
            value={loggedInUserDetails?.email}
            disabled
          />
        </div>
        <input
          type="hidden"
          id="id"
          {...register("id")}
          value={loggedInUserDetails?.id}
        />
        <div className="w-full p-4 border-b-2 ">
          <p>Phone Number</p>
          <Input
            {...register("phone")}
            // error={errors.phone}
            type="number"
            placeholder="Phone Number"
            defaultValue={loggedInUserDetails?.phone}
          />
        </div>
        <div className="flex items-center justify-center w-full p-4 border-b-2 ">
          <Button disabled={!isDirty || isPending} isLoading={isPending}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
