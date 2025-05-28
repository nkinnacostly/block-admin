import {
  useMutation,
  useQuery,
  UseMutationOptions,
  QueryKey,
} from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { getSessionStorageItem } from "../utils/storage";

interface ApiError {
  message: string;
  status: number;
}

const axiosInstanceLevel2 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_2,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

function useApiClientLevel2() {
  const makeRequest = async <T,>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    const token = getSessionStorageItem({ key: "__session" });

    const mergedConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axiosInstanceLevel2({
        url,
        method,
        data,
        ...mergedConfig,
      });

      return response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError.response?.data?.message || axiosError.message;
      throw new Error(`Request failed: ${errorMessage}`);
    }
  };

  const useGet = <T,>(
    url: string,
    queryKey: QueryKey,
    options: {
      enabled?: boolean;
      config?: AxiosRequestConfig;
    } = {}
  ) => {
    const { enabled = true, config = {} } = options;

    return useQuery({
      queryKey,
      queryFn: () => makeRequest<T>(url, "GET", undefined, config),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled,
    });
  };

  const useMutationRequest = <T, TData = unknown>(
    mutationOptions?: UseMutationOptions<
      AxiosResponse<T>,
      AxiosError<ApiError>,
      {
        url: string;
        method?: "POST" | "PUT" | "DELETE" | "PATCH";
        data?: TData;
        config?: AxiosRequestConfig;
      }
    >
  ) => {
    return useMutation({
      mutationFn: ({ url, method = "POST", data, config = {} }) =>
        makeRequest<T>(url, method, data, config),
      ...mutationOptions,
    });
  };

  return {
    useGet,
    useMutationRequest,
  };
}

export default useApiClientLevel2;
