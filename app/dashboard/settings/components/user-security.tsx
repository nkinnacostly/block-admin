"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function UserSecurity() {
  return (
    <div className="flex flex-col items-start justify-start w-full p-4 space-y-5 shadow-xl rounded-xl border-2">
      <p className="text-xl font-medium mt-[2rem] text-start">
        Security and Privacy
      </p>
      <div className="flex flex-col items-start justify-start w-full p-4 border-b-2">
        <p>Password</p>
        <p>*************</p>
        {/* <ToggleSwitch /> */}
      </div>
      <div className="flex items-center justify-between w-full p-4 space-x-3 ">
        <Label htmlFor="airplane-mode">2FA</Label>
        <Switch id="airplane-mode" />
      </div>
    </div>
  );
}

export default UserSecurity;
