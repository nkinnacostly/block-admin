import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetBadges = () => {
  const { useGet } = useFetchLevel2();
  const url = `/show-badges`;
  const reqKey = ["badges"];
  const { data, error, isLoading } = useGet(url, reqKey);

  return { data, error, isLoading };
};
