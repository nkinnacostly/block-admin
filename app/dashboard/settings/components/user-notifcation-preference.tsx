"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { toast } from "sonner";
import useApiRequest from "@/hooks/useCustonApiQuery";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificationSchema } from "@/schemas/settings";

type NotificationFormData = {
  notification_email: boolean;
  notification_push: boolean;
  notification_sms: boolean;
  id: number;
};

type NotificationField =
  | "notification_email"
  | "notification_push"
  | "notification_sms";

interface UserDetails {
  id?: string;
  notification_email?: string;
  notification_push?: string;
  notification_sms?: string;
}

function UserNotificationPreference() {
  const { useMutationRequest } = useApiRequest();
  const { loggedInUserDetails } = useUserStore();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutationRequest();
  const { getValues, watch, setValue } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      notification_email: false,
      notification_sms: false,
      notification_push: false,
      id: Number(loggedInUserDetails?.id) || 0,
    },
  });
  const values = getValues();

  const onSubmit = async (userData: NotificationFormData) => {
    try {
      await mutateAsync(
        {
          method: "POST",
          url: "/select_notification_preference",
          data: {
            ...userData,
            notification_email: userData.notification_email ? "on" : "off",
            notification_push: userData.notification_push ? "on" : "off",
            notification_sms: userData.notification_sms ? "on" : "off",
          },
        },
        {
          onSuccess: (data: any) => {
            // console.log(data);
            toast.error(data.message);
            queryClient.refetchQueries({
              queryKey: ["users-info"],
            });
          },
          onError: (error: any) => {
            toast.error(error.message);
            // console.log(error, "This is error");
          },
        }
      );
    } catch (error) {
      // console.error("Error adding data:", error.message);
    }
  };

  useEffect(() => {
    if (loggedInUserDetails) {
      const userDetails = loggedInUserDetails as unknown as UserDetails;
      setValue("notification_email", userDetails.notification_email === "1");
      setValue("notification_push", userDetails.notification_push === "1");
      setValue("notification_sms", userDetails.notification_sms === "1");
    }
  }, [loggedInUserDetails, setValue]);

  const handleCheckedChange = (name: NotificationField, value: boolean) => {
    setValue(name, value);
    if (name === "notification_email") {
      onSubmit({
        notification_email: value,
        notification_push: values.notification_push,
        notification_sms: values.notification_sms,
        id: Number(loggedInUserDetails?.id) || 0,
      });
    }
    if (name === "notification_push") {
      onSubmit({
        notification_email: values.notification_email,
        notification_push: value,
        notification_sms: values.notification_sms,
        id: Number(loggedInUserDetails?.id) || 0,
      });
    }
    if (name === "notification_sms") {
      onSubmit({
        notification_email: values.notification_email,
        notification_push: values.notification_push,
        notification_sms: value,
        id: Number(loggedInUserDetails?.id) || 0,
      });
    }
  };

  return (
    <div className="flex flex-col items-start justify-start w-full p-5 space-y-5 shadow-xl rounded-xl border-2">
      <p className="text-xl font-medium mt-[2rem] text-start">
        Notification Preferences
      </p>
      <div className="flex items-center justify-between w-full p-4 space-x-3 border-b-2">
        <Label htmlFor="email">Email Notification</Label>
        <Switch
          name="notification_email"
          checked={watch("notification_email")}
          onCheckedChange={(value) =>
            handleCheckedChange("notification_email", value)
          }
        />
      </div>
      <div className="flex items-center justify-between w-full p-4 space-x-3 border-b-2">
        <Label htmlFor="push">Push Notification</Label>
        <Switch
          name="notification_push"
          checked={watch("notification_push")}
          onCheckedChange={(value) =>
            handleCheckedChange("notification_push", value)
          }
        />
      </div>
      <div className="flex items-center justify-between w-full p-4 space-x-3 border-b-2">
        <Label htmlFor="sms">SMS Notification</Label>
        <Switch
          name="notification_sms"
          checked={watch("notification_sms")}
          onCheckedChange={(value) =>
            handleCheckedChange("notification_sms", value)
          }
        />
      </div>
    </div>
  );
}

export default UserNotificationPreference;
