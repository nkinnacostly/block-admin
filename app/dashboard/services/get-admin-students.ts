import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetAdminStudents = () => {
  const { useGetRequest2 } = useFetchLevel2();
  const url = `/admin/get-all-users`;
  const reqKey = ["admin-students"];
  const { data, error, isLoading } = useGetRequest2(url, reqKey);

  return { data, error, isLoading };
};
