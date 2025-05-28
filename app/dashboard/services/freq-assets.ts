import useFetchLevel2 from "@/hooks/useFetchLevel2";

export const useGetFreqAssets = () => {
  const { useGet } = useFetchLevel2();
  const url = `/frequently-traded-assets`;
  const reqKey = ["freq-assets"];
  const { data, error, isLoading } = useGet(url, reqKey);

  return { data, error, isLoading };
};
