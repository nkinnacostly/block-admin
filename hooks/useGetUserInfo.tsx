import useFetchLevel2 from "./useFetchLevel2";
import { useEffect } from "react";
import { UserDetails, useUserStore } from "../store/store";

interface UserData {
  data?: {
    user?: UserDetails;
  };
}

function useGetUserInfo() {
  const { setLoggedInUserDetails } = useUserStore();
  // console.log(loggedInUserDetails, "loggedInUserDetails");
  // const lll = getSessionStorageItem({ key: "user-data" });
  // console.log(lll, "lll");
  const url = `/admin/get-single-user`;
  const reqKey = ["users-info"];
  const { useGetRequest2 } = useFetchLevel2();
  const { data, error, isLoading, isSuccess } = useGetRequest2<UserData>(
    url,
    reqKey
  );

  useEffect(() => {
    if (isSuccess && data?.data?.data?.user) {
      // setlll(data.data.data.user);
      setLoggedInUserDetails(data.data.data.user as UserDetails);
    }
  }, [isSuccess, data, setLoggedInUserDetails]);

  return { data, error, isLoading };
}

export default useGetUserInfo;
