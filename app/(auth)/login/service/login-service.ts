import { request2 } from "@/utils/network";
import { useMutation } from "@tanstack/react-query";

interface LoginUserDetails {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  data: any;
  message?: string;
}

export const logInUser = async (
  userDetails: LoginUserDetails
): Promise<LoginResponse> => {
  const response = await request2({
    url: `/admin/login`,
    method: "POST",
    data: userDetails,
  });

  return response as LoginResponse;
};

export const useCreateStore = () => {
  const mutation = useMutation<LoginResponse, Error, LoginUserDetails>({
    mutationFn: logInUser,
  });

  return mutation;
};
