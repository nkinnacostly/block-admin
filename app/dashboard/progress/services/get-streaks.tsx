import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetStreaks = () => {
  const { useGet } = useFetchLevel2();
  const url = `/trade-streaks`;
  const reqKey = ["streaks"];
  const { data, error, isLoading } = useGet(url, reqKey);

  return { data, error, isLoading };
};
