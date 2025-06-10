import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useApproveRequest = (id?: string) => {
  const { useGet } = useFetchLevel2();
  const url = `admin/approve-reset-profile/${id}`;
  const reqKey = ["approve-journal"];
  const { data, error, isLoading, refetch, isSuccess } = useGet(url, reqKey, {
    enabled: false,
  });

  return { data, error, isLoading, refetch, isSuccess };
};
