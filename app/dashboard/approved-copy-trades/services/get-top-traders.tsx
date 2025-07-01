import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetTopTraders = () => {
  const { useGet } = useFetchLevel2();
  const url = `/top-traders`;
  const reqKey = ["top-traders"];
  const { data, error, isLoading } = useGet(url, reqKey);

  return { data, error, isLoading };
};
