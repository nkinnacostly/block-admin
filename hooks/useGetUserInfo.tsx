import useApiRequest from "./useCustonApiQuery";
import { useEffect } from "react";
import { UserDetails, useUserStore } from "../store/store";

interface UserData {
  data?: {
    user?: UserDetails;
  };
}

function useGetUserInfo() {
  const { loggedInUserDetails, setLoggedInUserDetails } = useUserStore();
  // console.log(loggedInUserDetails, "loggedInUserDetails");
  // const lll = getSessionStorageItem({ key: "user-data" });
  // console.log(lll, "lll");
  const url = `/admin/single-user?id=${loggedInUserDetails.id}`;
  const reqKey = ["users-info"];
  const { useGetRequest } = useApiRequest();
  const { data, error, isLoading, isSuccess } = useGetRequest<UserData>(
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
