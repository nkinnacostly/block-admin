import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const GetTradesEntry = () => {
  const { useGet } = useFetchLevel2();
  const url = `/admin/all-journal-trades`;
  const reqKey = ["journal-trades"];
  const { data, error, isLoading } = useGet(url, reqKey);

  return { data, error, isLoading };
};
