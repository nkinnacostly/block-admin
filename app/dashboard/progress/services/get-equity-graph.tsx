import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetEquityGraph = () => {
  const { useGet } = useFetchLevel2();
  const url = `/equityGrowth`;
  const reqKey = ["equity-graph"];
  const { data, error, isLoading } = useGet(url, reqKey);

  return { data, error, isLoading };
};
