"use client";

import { GiProgression } from "react-icons/gi";
import { GoBook } from "react-icons/go";
import Image from "next/image";
import { IoMdSettings } from "react-icons/io";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdDashboard, MdOutlineMeetingRoom } from "react-icons/md";
import React, { memo, useMemo } from "react";
import { TbTargetArrow } from "react-icons/tb";
import { TbCheck } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/store/store";
// import { useUserStore } from "@/store/store";
// import { useVideoStore } from "@/store/store";

const SidebarLink = memo(({ icon, title, link, isActive, disabled }) => (
  <Link
    className={`
      flex items-center justify-start rounded-lg px-3 cursor-pointer
      ${isActive ? "bg-[#1E1E1E99] border border-green-300" : ""}
      ${disabled ? "pointer-events-none opacity-50" : ""}
      hover:bg-[#1E1E1E66] transition-colors
    `}
    href={disabled ? "#" : link}
  >
    <span className="flex items-center justify-center w-6">{icon}</span>
    <span className="text-[16px] font-[400] p-2">{title}</span>
  </Link>
));

SidebarLink.displayName = "SidebarLink";

const DashboardSidebar = () => {
  const { loggedInUserDetails } = useUserStore();
  // const { watchedVideos } = useVideoStore();
  // const router = useRouter();
  // const isLevel1 = loggedInUserDetails?.learners_level === "1";
  const pathname = usePathname();
  // console.log(pathname, "This is pathname");
  const sideLinks = useMemo(
    () => [
      {
        icon: <MdDashboard />,
        title: "Students",
        link: "/dashboard",
      },
      {
        icon: <GoBook />,
        title: "All Journal Trades",
        link: "/dashboard/courses",
      },
      {
        icon: <GiProgression />,
        title: "Trade Profile",
        link: "/dashboard/progress",
      },
      {
        icon: <TbTargetArrow />,
        title: "Copy Trades",
        link: "/dashboard/copy-trade",
      },
      {
        icon: <TbCheck />,
        title: "Approved Copy Trades",
        link: "/dashboard/approved-copy-trades",
      },
      {
        icon: <MdOutlineMeetingRoom />,
        title: "Meetings",
        link: "/dashboard/meetings",
      },
      {
        icon: <TbTargetArrow />,
        title: "Journal Requests",
        link: "/dashboard/journal-request",
      },
      // {
      //   icon: <TbTargetArrow />,
      //   title: "Refer and Earn",
      //   link: "/dashboard/challenges",
      //   disabled: watchedVideos !== 3 || isLevel1,
      // },
      {
        icon: <IoMdSettings />,
        title: "Settings",
        link: "/dashboard/settings",
      },
    ],
    []
  );

  return (
    <div className="flex flex-col w-full h-full px-5 space-y-3 border-2 py-5 rounded-xl">
      <div className="flex items-center justify-center">
        <div className="relative w-20 h-20 border-2 rounded-full overflow-hidden">
          <Image
            src={loggedInUserDetails?.image_url || "/assets/img/png/chef.png"}
            fill
            className="object-cover"
            alt="Profile"
            sizes="80px"
            priority
          />
        </div>
      </div>
      <nav className="space-y-2">
        {sideLinks.map((link) => (
          <SidebarLink
            key={link.link}
            icon={link.icon}
            title={link.title}
            link={link.link}
            isActive={pathname === link.link}
            disabled={link.disabled}
          />
        ))}
      </nav>
    </div>
  );
};

export default memo(DashboardSidebar);
