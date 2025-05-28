import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetAllProfileTrades = () => {
  const { useGet } = useFetchLevel2();
  const url = `/admin/all-profile-trades`;
  const reqKey = ["all-profile-trades"];
  const { data, error, isLoading } = useGet(url, reqKey);

  return { data, error, isLoading };
};
