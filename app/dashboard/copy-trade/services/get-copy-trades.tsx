import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetCopyTrades = () => {
  const { useGet } = useFetchLevel2();
  const url = `/top-traders`;
  const reqKey = ["copy-trades"];
  const { data, error, isLoading } = useGet(url, reqKey);

  return { data, error, isLoading };
};
