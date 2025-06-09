import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetSingleStudentCopyTrade = (id: string) => {
  const { useGet } = useFetchLevel2();
  const url = `/admin/get-copy-trade-profile?user_id=${id}`;
  const reqKey = ["admin-students-copy-trade", id];
  const { data, error, isLoading, isFetching } = useGet(url, reqKey);

  return { data, error, isLoading, isFetching };
};
