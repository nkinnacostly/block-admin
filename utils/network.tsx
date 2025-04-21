import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getSessionStorageItem } from "./storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BASE_URL_2 = process.env.NEXT_PUBLIC_API_BASE_URL_2;
const client = axios.create({
  baseURL: BASE_URL,
});

const client2 = axios.create({
  baseURL: BASE_URL_2,
});

interface RequestOptions extends AxiosRequestConfig {
  // Add any additional options specific to your application
}

export const request = async <T,>(options: RequestOptions): Promise<T> => {
  const session_id = getSessionStorageItem({ key: "__session" });
  client.defaults.headers.common.Authorization = `Bearer ${session_id}`;

  const onSuccess = (response: AxiosResponse<T>): T => {
    return response.data;
  };

  const onError = (error: any): Promise<never> => {
    return Promise.reject(error.response?.data);
  };

  return client(options).then(onSuccess).catch(onError);
};
export const request2 = async <T,>(options: RequestOptions): Promise<T> => {
  const session_id = getSessionStorageItem({ key: "__session" });
  client2.defaults.headers.common.Authorization = `Bearer ${session_id}`;

  const onSuccess = (response: AxiosResponse<T>): T => {
    return response.data;
  };

  const onError = (error: any): Promise<never> => {
    return Promise.reject(error.response?.data);
  };

  return client2(options).then(onSuccess).catch(onError);
};
