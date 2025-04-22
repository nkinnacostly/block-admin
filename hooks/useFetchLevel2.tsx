import { useMutation, useQuery, QueryKey } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { getSessionStorageItem } from "../utils/storage";
// import { useUserStore } from "@/store/store";
// import { toast } from "sonner";

// Define types for API responses and errors
interface ApiError {
  message: string;
  status: number;
}

const axiosInstanceLevel2 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_2,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Custom hook for handling API requests
function useFetchLevel2() {
  const token = getSessionStorageItem({ key: "__session" });

  // Generic request function that handles all HTTP methods
  const makeRequest = async <T,>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    try {
      const response = await axiosInstanceLevel2({
        url,
        method,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
          ...config.headers,
        },
        ...config,
      });
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError.response?.data?.message || axiosError.message;
      throw new Error(`Request failed: ${errorMessage}`);
    }
  };

  // Improved GET request hook with better typing
  const useGetRequest2 = <T,>(
    url: string,
    reqKey: QueryKey,
    options: {
      enabled?: boolean;
      config?: AxiosRequestConfig;
    } = {}
  ) => {
    const { enabled = true, config = {} } = options;

    return useQuery({
      queryKey: reqKey,
      queryFn: () => makeRequest<T>(url, "GET", undefined, config),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled,
    });
  };

  // Enhanced mutation hook supporting all HTTP methods
  const useMutationRequest2 = <T, TData = unknown>() => {
    return useMutation({
      mutationFn: ({
        url,
        method = "POST",
        data,
        config = {},
      }: {
        url: string;
        method?: "POST" | "PUT" | "DELETE" | "PATCH";
        data?: TData;
        config?: AxiosRequestConfig;
      }) => makeRequest<T>(url, method, data, config),
    });
  };

  return {
    useGetRequest2,
    useMutationRequest2,
  };
}

export default useFetchLevel2;
