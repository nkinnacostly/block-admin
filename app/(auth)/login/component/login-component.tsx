"use client";

import { AnimatePage } from "@/components/animations/page";

import Link from "next/link";
import LoginHeader from "@/components/loginHeader";

import React from "react";

import { storeItemToSessionStorage } from "@/utils/storage";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useCreateStore } from "../service/login-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileSchema } from "@/schemas/login";

interface LoginFormData {
  username: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const { mutateAsync, isPending } = useCreateStore();
  const router = useRouter();
  const { setLoggedInUserDetails } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (userData: LoginFormData) => {
    try {
      const response = await mutateAsync(userData);
      if (response) {
        console.log(response, "response");
        toast.success(`Login Successful`);
        Cookies.set("__session", response?.token);
        storeItemToSessionStorage({ key: "__session", value: response?.token });
        setLoggedInUserDetails(response.data);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login failed:", error.error);
      toast.error(`${error.error}`);
    }
  };

  return (
    <div className="h-screen w-full  flex flex-col items-center justify-center px-10 ">
      <LoginHeader />
      <form
        action="post"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* <TimeoutAlert message={error?.error} show={isError} duration={3000} /> */}
        <Input
          // inputText={"Username"}
          placeholder={"Enter Username"}
          // name={"username"}
          // register={register}
          type="text"
          {...register("username")}
          // error={errors.username}
        />
        <Input
          placeholder={"Enter Password"}
          type="password"
          //  register={register}
          {...register("password")}
          // error={errors.password}
          required
        />
        <p className="text-[16px] font-[400]  p-2 mt-2">
          By creating an account, you agree to the{" "}
          <span className="underline cursor-pointer">Terms of use</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
        <Button
          // btnText={"Login"}
          className={"disabled:bg-gray-400 bg-yellow-400 w-full"}
          disabled={isPending || !isDirty}
          isLoading={isPending}
        >
          Login
        </Button>
      </form>
      <div className="flex items-center justify-center w-full">
        <p className="text-[16px] font-[400]  p-2">
          Do not have an account?{" "}
          <Link
            className="underline cursor-pointer text-[#EE1D52]"
            href={"/sign-up"}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AnimatePage(LoginComponent);
