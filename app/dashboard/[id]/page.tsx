import React from "react";
import StudentProfileComponent from "@/app/dashboard/components/student-profile-component";
import StudentTradeProfile from "@/app/dashboard/components/student-trade-profile";
import StudentCopyTrade from "@/app/dashboard/components/student-copy-trade";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-4">
      <StudentProfileComponent id={id} />
      <StudentTradeProfile id={id} />
      <StudentCopyTrade id={id} />
    </div>
  );
}

export default page;
