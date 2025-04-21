import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const GetTradesEntry = () => {
  const { useGetRequest2 } = useFetchLevel2();
  const url = `/admin/all-journal-trades`;
  const reqKey = ["journal-trades"];
  const { data, error, isLoading } = useGetRequest2(url, reqKey);

  return { data, error, isLoading };
};
