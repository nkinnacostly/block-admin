"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useFetchLevel2 from "@/hooks/useFetchLevel2";

const CreateUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  notification_status: z.number(),
});

type CreateUserFormData = z.infer<typeof CreateUserSchema>;

interface CreateUserResponse {
  message: string;
  user: CreateUserFormData;
}

interface CreateUserError {
  message: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const { useMutationRequest } = useFetchLevel2();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      notification_status: 0,
    },
  });

  const { mutate: createUser, isPending } =
    useMutationRequest<CreateUserResponse>();

  const onSubmit = (userData: CreateUserFormData) => {
    createUser(
      {
        method: "POST",
        url: "/admin/add-student",
        data: userData,
      },
      {
        onSuccess: () => {
          toast.success("User created successfully");
          router.push("/dashboard");
          queryClient.invalidateQueries({
            queryKey: ["admin-students"],
            refetchType: "active",
            exact: true,
          });
        },
        onError: (error: CreateUserError) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New User</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register("username")}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="notification_status"
              onCheckedChange={(checked) =>
                setValue("notification_status", checked ? 1 : 0)
              }
            />
            <Label htmlFor="notification_status">Enable Notifications</Label>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating..." : "Create User"}
          </Button>
        </form>
      </div>
    </div>
  );
}
