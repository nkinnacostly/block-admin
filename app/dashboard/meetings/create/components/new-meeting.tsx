"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useScheduleMeeting } from "../../services/schedule-meeting";

// import { useQueryClient } from "@tanstack/react-query";

const meetingSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  start_time: z.date(),
  end_time: z.date(),
  type: z.enum(["all", "level_3", "traders"]),
  zoom_meeting_id: z.string().optional(),
  meeting_url: z.string().url("Please enter a valid URL").optional(),
  password: z.string(),
});

type MeetingFormData = z.infer<typeof meetingSchema>;

function CreateMeeting() {
  // const queryClient = useQueryClient();
  const { scheduleMeeting, isPending, error } = useScheduleMeeting();
  const form = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      type: "all",
    },
  });

  const onSubmit = async (data: MeetingFormData) => {
    try {
      scheduleMeeting({
        topic: data.topic,
        start_time: format(data.start_time, "yyyy-MM-dd HH:mm:ss"),
        end_time: format(data.end_time, "yyyy-MM-dd HH:mm:ss"),
        type: data.type,
        zoom_meeting_id: data.zoom_meeting_id,
        meeting_url: data.meeting_url,
        password: data.password,
      });
    } catch (error) {
      toast.error("Failed to schedule meeting");
    }
  };

  return (
    <div className="container">
      <Card className="p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Meeting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Meeting Topic</Label>
              <Input
                id="topic"
                placeholder="Enter meeting topic"
                {...form.register("topic")}
                disabled={isPending}
              />
              {form.formState.errors.topic && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.topic.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch("start_time") && "text-muted-foreground"
                      )}
                      disabled={isPending}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("start_time") ? (
                        format(form.watch("start_time"), "PPP p")
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.watch("start_time")}
                      onSelect={(date) => {
                        if (date) {
                          const currentDate = form.watch("start_time") || date;
                          const newDate = setHours(
                            setMinutes(date, currentDate.getMinutes()),
                            currentDate.getHours()
                          );
                          form.setValue("start_time", newDate);
                        }
                      }}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={
                            form.watch("start_time")
                              ? format(form.watch("start_time"), "HH:mm")
                              : "00:00"
                          }
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            const currentDate =
                              form.watch("start_time") || new Date();
                            const newDate = new Date(currentDate);
                            newDate.setHours(hours);
                            newDate.setMinutes(minutes);
                            form.setValue("start_time", newDate);
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !form.watch("end_time") && "text-muted-foreground"
                      )}
                      disabled={isPending}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("end_time") ? (
                        format(form.watch("end_time"), "PPP p")
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.watch("end_time")}
                      onSelect={(date) => {
                        if (date) {
                          const currentDate = form.watch("end_time") || date;
                          const newDate = setHours(
                            setMinutes(date, currentDate.getMinutes()),
                            currentDate.getHours()
                          );
                          form.setValue("end_time", newDate);
                        }
                      }}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={
                            form.watch("end_time")
                              ? format(form.watch("end_time"), "HH:mm")
                              : "00:00"
                          }
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            const currentDate =
                              form.watch("end_time") || new Date();
                            const newDate = new Date(currentDate);
                            newDate.setHours(hours);
                            newDate.setMinutes(minutes);
                            form.setValue("end_time", newDate);
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Meeting Type</Label>
              <Select
                value={form.watch("type")}
                onValueChange={(value) => form.setValue("type", value as any)}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>

                  <SelectItem value="level_3">All Level 3 Students</SelectItem>
                  <SelectItem value="traders">All Traders</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zoom_meeting_id">Zoom Meeting ID</Label>
              <Input
                id="zoom_meeting_id"
                placeholder="Enter Zoom meeting ID"
                {...form.register("zoom_meeting_id")}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting_url">Meeting URL</Label>
              <Input
                id="meeting_url"
                placeholder="Enter meeting URL"
                {...form.register("meeting_url")}
                disabled={isPending}
              />
              {form.formState.errors.meeting_url && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.meeting_url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Meet Password</Label>
              <Input
                id="password"
                placeholder="Enter meeting Password"
                {...form.register("password")}
                disabled={isPending}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="text-sm text-red-500">
                {error instanceof Error ? error.message : String(error)}
                {error &&
                  typeof error === "object" &&
                  "errors" in error &&
                  Object.entries(
                    (error as { errors: Record<string, string[]> }).errors
                  ).map(([field, messages]) => (
                    <div key={field}>
                      {messages.map((message: string) => (
                        <p key={message}>{message}</p>
                      ))}
                    </div>
                  ))}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateMeeting;
