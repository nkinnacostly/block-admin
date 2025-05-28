"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Textarea } from "@/components/ui/text-area";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { useUserStore } from "@/store/store";
import useFetchLevel2 from "@/hooks/useFetchLevel2";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
const traderSetupSchema = z.object({
  starting_equity: z.string().min(1, "Starting equity is required"),
  broker: z.string().min(1, "Broker is required"),
  login: z.string().min(1, "Login is required"),
  investor_password: z.string().min(1, "Investor password is required"),
  server_name: z.string().min(1, "server_name is required"),
});

const tradeEntrySchema = z.object({
  trading_pair: z.string().min(1, "Trading pair is required"),
  trade_type: z.enum(["buy", "sell"]),
  price: z.string().min(1, "Entry price is required"),
  entry_time: z.string().min(1, "Entry time is required"),
  closing_price: z.string().min(1, "Closing price is required"),
  closing_time: z.string().min(1, "Closing time is required"),
  day_date: z.string().min(1, "Date is required"),
  result: z.string().min(1, "Result is required"),
  result_amount: z.string().min(1, "Amount is required"),
  setup_name: z.string().min(1, "Setup name is required"),
  note: z.string().optional(),
});

export type TraderSetupForm = z.infer<typeof traderSetupSchema>;
export type TradeEntryForm = z.infer<typeof tradeEntrySchema>;

function JournalTrades() {
  const { loggedInUserDetails } = useUserStore();
  console.log(loggedInUserDetails, "loggedInUserDetails");
  const [isSetupComplete, setIsSetupComplete] = React.useState(false);
  const { useMutationRequest } = useFetchLevel2();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: addTraderProfile, isPending } = useMutationRequest();
  const { mutate: addJournalTrades, isPending: isJournalTradesPending } =
    useMutationRequest();
  const {
    register: registerSetup,
    handleSubmit: handleSetupSubmit,
    formState: { errors: setupErrors, isDirty: isSetupDirty },
  } = useForm<TraderSetupForm>({
    resolver: zodResolver(traderSetupSchema),
  });

  const {
    register: registerTrade,
    handleSubmit: handleTradeSubmit,
    formState: { errors: tradeErrors },
    reset: resetTrade,
    setValue,
  } = useForm<TradeEntryForm>({
    resolver: zodResolver(tradeEntrySchema),
  });

  const onSetupSubmit = async (data: TraderSetupForm) => {
    try {
      addTraderProfile(
        {
          url: "/trader-profile-add",
          method: "POST",
          data,
        },
        {
          onSuccess: () => {
            setIsSetupComplete(true);
          },
        }
      );
    } catch (error) {
      console.error("Setup submission failed:", error);
    }
  };

  const onTradeSubmit = (data: TradeEntryForm) => {
    const formattedData = {
      ...data,
      entry_time: new Date(data.entry_time).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      closing_time: new Date(data.closing_time).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    addJournalTrades(
      {
        url: "/Add-Trade",
        method: "POST",
        data: formattedData,
      },
      {
        onSuccess: () => {
          toast.success("Trade added successfully");
          queryClient.invalidateQueries({ queryKey: ["journal-trades"] });
          router.push("/dashboard/courses");
          resetTrade();
        },
      }
    );
  };

  if (!isSetupComplete && loggedInUserDetails?.has_journal === 0) {
    return (
      <div className="w-full flex flex-col gap-4 items-start justify-center">
        <Link href={"/dashboard/courses"} className="flex items-center gap-2">
          <ArrowLeftIcon className="w-4 h-4 " />
          <p className="text-sm font-medium">Back</p>
        </Link>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-medium">Trader Account Setup</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-6">
            <form
              onSubmit={handleSetupSubmit(onSetupSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="starting_equity">Starting Equity ($)</Label>
                <Input
                  id="starting_equity"
                  type="number"
                  {...registerSetup("starting_equity")}
                />
                {setupErrors.starting_equity && (
                  <p className="text-sm text-red-500">
                    {setupErrors.starting_equity.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="broker">Broker</Label>
                <Input id="broker" {...registerSetup("broker")} />
                {setupErrors.broker && (
                  <p className="text-sm text-red-500">
                    {setupErrors.broker.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login">Login</Label>
                <Input id="login" {...registerSetup("login")} />
                {setupErrors.login && (
                  <p className="text-sm text-red-500">
                    {setupErrors.login.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="investor_password">Investor Password</Label>
                <Input
                  id="investor_password"
                  type="password"
                  {...registerSetup("investor_password")}
                />
                {setupErrors.investor_password && (
                  <p className="text-sm text-red-500">
                    {setupErrors.investor_password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="server_name">server_name</Label>
                <Input id="server_name" {...registerSetup("server_name")} />
                {setupErrors.server_name && (
                  <p className="text-sm text-red-500">
                    {setupErrors.server_name.message}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500">
                * Only signal provider account is accepted
              </p>
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || !isSetupDirty}
              >
                {isPending ? "Setting up account..." : "Submit Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Journal Trade Entry</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="p-6">
        <form onSubmit={handleTradeSubmit(onTradeSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trading_pair">Trading Pair/Asset</Label>
              <Input id="trading_pair" {...registerTrade("trading_pair")} />
              {tradeErrors.trading_pair && (
                <p className="text-sm text-red-500">
                  {tradeErrors.trading_pair.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tradeType">Buy/Sell</Label>
              <Select
                onValueChange={(value) =>
                  setValue("trade_type", value as "buy" | "sell")
                }
                // defaultValue="buy"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trade type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
              {tradeErrors.trade_type && (
                <p className="text-sm text-red-500">
                  {tradeErrors.trade_type.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.00001"
                {...registerTrade("price")}
              />
              {tradeErrors.price && (
                <p className="text-sm text-red-500">
                  {tradeErrors.price.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="entryTime">Entry Time</Label>
              <Input
                id="entry_time"
                type="datetime-local"
                {...registerTrade("entry_time")}
              />
              {tradeErrors.entry_time && (
                <p className="text-sm text-red-500">
                  {tradeErrors.entry_time.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="closingPrice">Closing Price</Label>
              <Input
                id="closingPrice"
                type="number"
                step="0.00001"
                {...registerTrade("closing_price")}
              />
              {tradeErrors.closing_price && (
                <p className="text-sm text-red-500">
                  {tradeErrors.closing_price.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="closingTime">Closing Time</Label>
              <Input
                id="closing_time"
                type="datetime-local"
                {...registerTrade("closing_time")}
              />
              {tradeErrors.closing_time && (
                <p className="text-sm text-red-500">
                  {tradeErrors.closing_time.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="day_date">Date</Label>
              <Input id="day_date" {...registerTrade("day_date")} />
              {tradeErrors.day_date && (
                <p className="text-sm text-red-500">
                  {tradeErrors.day_date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="result_amount">Amount ($)</Label>
              <Input
                id="result_amount"
                type="number"
                {...registerTrade("result_amount")}
              />
              {tradeErrors.result_amount && (
                <p className="text-sm text-red-500">
                  {tradeErrors.result_amount.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="result">Result</Label>
              <Select
                onValueChange={(value) => setValue("result", value)}
                // defaultValue="breakeven"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Profit">Profit</SelectItem>
                  <SelectItem value="Loss">Loss</SelectItem>
                  <SelectItem value="Breakeven">Breakeven</SelectItem>
                </SelectContent>
              </Select>
              {tradeErrors.result && (
                <p className="text-sm text-red-500">
                  {tradeErrors.result.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="setup_name">Setup Name</Label>
              <Input id="setup_name" {...registerTrade("setup_name")} />
              {tradeErrors.setup_name && (
                <p className="text-sm text-red-500">
                  {tradeErrors.setup_name.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Notes</Label>
            <Textarea
              id="note"
              placeholder="Add your notes here..."
              className="min-h-[100px]"
              {...registerTrade("note")}
            />
            {tradeErrors.note && (
              <p className="text-sm text-red-500">{tradeErrors.note.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isJournalTradesPending}
            isLoading={isJournalTradesPending}
          >
            Submit Trade
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default JournalTrades;
