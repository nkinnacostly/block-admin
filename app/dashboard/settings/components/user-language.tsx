"use client";

function UserLanguage() {
  return (
    <div className="flex flex-col items-start justify-start w-full p-4 space-y-5 shadow-xl rounded-xl border-2">
      <p className="text-xl font-medium mt-[2rem] text-start">
        Language and Region
      </p>
      <div className="flex flex-col items-start justify-start w-full p-4 border-b-2">
        <p>Language</p>
        <p>English</p>
        {/* <ToggleSwitch /> */}
      </div>
    </div>
  );
}

export default UserLanguage;
