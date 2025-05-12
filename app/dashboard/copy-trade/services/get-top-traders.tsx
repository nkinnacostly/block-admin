import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetTopTraders = () => {
  const { useGetRequest2 } = useFetchLevel2();
  const url = `/top-traders`;
  const reqKey = ["top-traders"];
  const { data, error, isLoading } = useGetRequest2(url, reqKey);

  return { data, error, isLoading };
};
