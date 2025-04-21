import React from "react";
import TradeProfileTable from "./components/trade-profile-table";
const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start w-full space-y-5  p-4">
      <TradeProfileTable />
      {/* <EquityGraph />
      <TradeStats />
      <Badges />
      <Streaks />
      <WinRate /> */}
    </div>
  );
};

export default ChatPage;
