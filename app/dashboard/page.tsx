"use client";
import React, { useEffect } from "react";

import { AnimatePage } from "@/components/animations/page";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import { motion } from "framer-motion";
import { UserTable } from "./components/user-table";
function Dashboard() {
  const router = useRouter();
  const { loggedInUserDetails } = useUserStore();

  useEffect(() => {
    if (loggedInUserDetails?.first_name === null) {
      router.push("/dashboard/settings");
    }
  }, [loggedInUserDetails?.first_name, router]);

  const appsContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 5,
        staggerChildren: 5,
      },
    },
  };

  return (
    <motion.div variants={appsContainer} initial="show" animate="show">
      <div>
        <h5 className="text-[24px] font-[500]">Students</h5>
        <UserTable />
      </div>
    </motion.div>
  );
}

export default AnimatePage(Dashboard);
