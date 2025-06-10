import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetAllPendingResetRequest = () => {
  const { useGet } = useFetchLevel2();
  const url = `admin/get-pending-trade-profile-request`;
  const reqKey = ["all-pending-journal"];
  const { data, error, isLoading, refetch } = useGet(url, reqKey);

  return { data, error, isLoading, refetch };
};
