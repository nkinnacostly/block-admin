import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetSingleStudentProfile = (id: string) => {
  const { useGet } = useFetchLevel2();
  const url = `/admin/get-single-student/${id}`;
  const reqKey = ["admin-students", id];
  const { data, error, isLoading, isFetching } = useGet(url, reqKey);

  return { data, error, isLoading, isFetching };
};
