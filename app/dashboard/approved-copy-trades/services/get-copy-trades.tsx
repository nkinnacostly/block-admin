import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetCopyTrades = () => {
  const { useGet } = useFetchLevel2();
  const url = `/get-all-shared-trades`;
  const reqKey = ["copy-trades-approved"];
  const { data, error, isLoading } = useGet(url, reqKey);

  return { data, error, isLoading };
};
