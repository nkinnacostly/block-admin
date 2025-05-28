"use client";

import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ImageUploading from "react-images-uploading";
import { toast } from "sonner";
import useApiRequest from "@/hooks/useCustonApiQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { ImageSchema } from "@/schemas/settings";
import { cn } from "@/lib/utils";
import { FiCamera, FiTrash2, FiUpload } from "react-icons/fi";

type ImageFormData = z.infer<typeof ImageSchema>;

export default function UserProfilePic() {
  const { loggedInUserDetails } = useUserStore();
  const maxNumber = 1;
  const { useMutationRequest } = useApiRequest();
  const { mutateAsync, isPending } = useMutationRequest();
  const [isHovering, setIsHovering] = useState(false);

  const queryClient = useQueryClient();

  const { control, handleSubmit, setValue, register, watch } =
    useForm<ImageFormData>({
      resolver: zodResolver(ImageSchema),
      defaultValues: {
        image: "",
        id: Number(loggedInUserDetails?.id) || 0,
      },
    });

  useEffect(() => {
    if (loggedInUserDetails) {
      setValue("id", Number(loggedInUserDetails?.id) || 0);
      setValue("image", (loggedInUserDetails as any).image_url || "");
    }
  }, [loggedInUserDetails, setValue]);

  const onSubmit = async (userData: ImageFormData) => {
    await mutateAsync(
      {
        method: "POST",
        url: "/upload_image",
        data: userData,
      },
      {
        onSuccess: (response) => {
          if (response && response.status >= 200 && response.status < 300) {
            queryClient.refetchQueries({
              queryKey: ["users-info"],
            });
            toast.success("Profile Updated Successfully");
          } else {
            toast.error(
              response?.data?.message || "Failed to update profile picture"
            );
          }
        },
        onError: (error) => {
          console.log(error, "This is error");
          const errorMessage =
            error?.message ||
            error?.message ||
            "Failed to update profile picture";
          toast.error(errorMessage);
        },
      }
    );
  };
  const currentImage = watch("image");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className=" p-8 rounded-xl shadow-md flex items-center justify-center flex-col space-y-5 border text-">
        <h2 className="text-xl font-medium  mb-2">Profile Picture</h2>
        <p className="text-sm  mb-4">Upload a professional profile photo</p>

        <Controller
          name="image"
          control={control}
          render={({ field: { onChange, value, ...others } }) => (
            <div className="relative">
              <ImageUploading
                value={value}
                onChange={(e) => onChange(e ? e[0]["data_url"] : "")}
                maxNumber={maxNumber}
                dataURLKey="data_url"
                {...others}
              >
                {({ onImageUpload, onImageRemove, isDragging, dragProps }) => (
                  <div className="flex flex-col items-center">
                    <div
                      className="relative group"
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                      // whileHover={{ scale: 1.03 }}
                      // transition={{ duration: 0.2 }}
                    >
                      <div
                        className={cn(
                          "rounded-full h-[220px] w-[220px] overflow-hidden",
                          "border-4 border-primary/10",
                          "shadow-lg transition-all duration-300",
                          isDragging && "border-primary border-dashed"
                        )}
                        {...dragProps}
                      >
                        {value ? (
                          <div className="w-full h-full relative">
                            <Image
                              src={value}
                              alt="Profile"
                              fill
                              objectFit="cover"
                              className="rounded-full"
                            />
                            {isHovering && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                <div className="flex gap-3">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onImageUpload();
                                    }}
                                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                  >
                                    <FiCamera className="h-5 w-5 text-gray-700" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onImageRemove(0);
                                    }}
                                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                  >
                                    <FiTrash2 className="h-5 w-5 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            onClick={onImageUpload}
                            className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <FiUpload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-gray-500 font-medium">
                              Upload Image
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Click or drag & drop
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {!value && (
                      <p className="text-sm  mt-4">
                        Supports JPG, PNG or GIF (Max 5MB)
                      </p>
                    )}
                  </div>
                )}
              </ImageUploading>
            </div>
          )}
        />
        <input
          type="hidden"
          id="id"
          {...register("id")}
          value={loggedInUserDetails?.id}
        />
        <Button
          type="submit"
          className={cn(
            "px-6 py-2 bg-primary hover:bg-primary/90 transition-colors",
            "font-medium rounded-lg",
            !currentImage && "opacity-50 cursor-not-allowed"
          )}
          disabled={isPending || !currentImage}
        >
          {isPending ? (
            <>
              <span className="animate-spin mr-2">⭮</span>
              Uploading...
            </>
          ) : (
            "Save Profile Picture"
          )}
        </Button>
      </div>
    </form>
  );
}
