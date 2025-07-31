// import Buttonwithbg from "@/components/ui/button-with-bg";
// import Buttonwithoutbg from "@/src/components/ui/button-without-bg";
import Image from "next/image";
import Logo from "@/public/assets/img/png/logo.png";
import React from "react";
import { useUserStore } from "@/store/store";

function DashboardHeader() {
  const { loggedInUserDetails } = useUserStore();
  return (
    <>
      <div className="items-center justify-center hidden w-full h-full p-4 mb-2 lg:flex">
        <div className="flex items-center w-full justify-evenly ">
          <div>
            <Image src={Logo} height={100} width={100} alt="logo" />
          </div>
          <div className="flex items-center justify-center space-x-5">
            {/* <Buttonwithoutbg Btntext={"Sign in"} /> */}
            {/* <Buttonwithbg btnText={"Create account"} /> */}
            <div className="w-20 h-20 border-2 rounded-full">
              <Image
                src={
                  loggedInUserDetails?.image_url || "/assets/img/png/chef.png"
                }
                width={100}
                height={100}
                className="w-full h-full rounded-full"
                alt="prof-img"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardHeader;
