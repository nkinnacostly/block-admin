import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetSingleStudentTradeProfile = (id: string) => {
  const { useGet } = useFetchLevel2();
  const url = `/admin/get-single-trade-profile/?user_id=${id}`;
  const reqKey = ["admin-students-trade-profile", id];
  const { data, error, isLoading, isFetching } = useGet(url, reqKey);

  return { data, error, isLoading, isFetching };
};
