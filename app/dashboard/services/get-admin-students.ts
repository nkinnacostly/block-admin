import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetAdminStudents = (page: number) => {
  const { useGet } = useFetchLevel2();
  const url = `/admin/get-all-users?page=${page}`;
  const reqKey = ["admin-students", page];
  const { data, error, isLoading, isFetching } = useGet(url, reqKey);

  return { data, error, isLoading, isFetching };
};
