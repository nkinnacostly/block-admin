import useFetchLevel2 from "@/hooks/useFetchLevel2";
import { getSessionStorageItem } from "@/utils/storage";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleStudentTradeProfile = (id: string) => {
  const { useGet } = useFetchLevel2();
  const url = `/admin/get-single-trade-profile?user_id=${id}`;
  const reqKey = ["admin-students-trade-profile", id];
  const { data, error, isLoading, isFetching } = useGet(url, reqKey);

  return { data, error, isLoading, isFetching };
};

export const useGetSingleStudentTraderWinRates = (id: string) => {
  const url = `https://block-traders.com.blocktraders.academy/api/equityGrowth?user_id=${id}`;
  const token = getSessionStorageItem({ key: "__session" });
  const reqKey = ["admin-students-trade-win-rates", id];
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: reqKey,
    queryFn: () =>
      fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  return { data, error, isLoading, isFetching };
};
