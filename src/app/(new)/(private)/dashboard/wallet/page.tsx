"use client";

import { createWalletStripeSession } from "@/app/api/wallet/createWalletSession";
import AddwalletModel from "@/components/dashboard/wallet/addWalletModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/constants";
import { createStripeSession } from "@/old-actions/createStripeSession";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { CoinsIcon, Loader, Plus, RefreshCcwIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function WalletPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();
  const paymentStatus = searchParams.get("payment_status");
  const sessionId = searchParams.get("session");
  const publishableKey = process.env
    .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;

  const stripePromise = loadStripe(publishableKey);
  const [open, setOpen] = React.useState<boolean>(false);
  const [walletAmount, setWalletAmount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  let _called = false;
  async function fetchWalletAmount() {
    setLoading(true);
    let id=session.data?.user?.id;
    if(session.data?.user?.isTeamMember){
      const adminData= await axios.get("/api/team/get-admin?id="+session.data?.user?.id);
      id=adminData.data?.admin_id;
    }
    try {
      
      const response = await axios.get(
        `/api/wallet?id=${id}`,
      );
      setWalletAmount(response.data.wallet);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  async function handlePayment() {
    if (_called) return;
    if (paymentStatus === "success" && sessionId) {
      try {
        setLoading(true);
        _called = true;
        let id = session.data?.user?.id;
        if (session.data?.user?.isTeamMember) {
          const adminData = await axios.get(
            "/api/team/get-admin?id=" + session.data?.user?.id,
          );
          id = adminData.data?.admin_id;
        }
        const response = await axios.post(`/api/wallet`, {
          sessionId,
          id: id,
        });
        console.log(response.data);

        setLoading(false);
        await fetchWalletAmount();
        toast({
          title: "Amount Added Successfully",
          description: `amount has been added to your wallet.`,
          variant: "default",
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      router.push(ROUTES.wallet);
    }
  }

  useEffect(() => {
    if (!session.data?.user) return;
    if (paymentStatus || sessionId) handlePayment();
    else fetchWalletAmount();
  }, [session?.data?.user?.id]);

  const handleAddAmount = async (amount: number) => {
    try {
      setOpen(false);
      const stripe: any = await stripePromise;
      const checkoutSession = await createWalletStripeSession({
        name: "Add amount to wallet",
        quantity: amount,
        wallet: true,
      });
      if (checkoutSession.isSuccess) {
        const redirectToStripe = await stripe.redirectToCheckout({
          sessionId: checkoutSession.data?.id,
        });
        if (redirectToStripe.error) {
          console.log(redirectToStripe.error);
        }
      } else {
        console.log(checkoutSession);
        toast({
          title: "Something went wrong",
          variant: "default",
        });
      }

      toast({
        title: "Amount Added Successfully",
        description: `An amount of $${amount.toFixed(2)} has been added to your wallet.`,
        variant: "default",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred while adding the amount. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <Loader className="mx-4 my-4 h-8 w-8 animate-spin justify-center text-blue-500" />
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-gray-500">Manage your wallet and funds</p>
        </div>
        {session?.data?.user?.role == "company" && (
          <Button onClick={() => setOpen(true)}>
            {/* <Plus className="mr-2 h-4 w-4" /> */}
            Add Funds
          </Button>
        )}
      </div>
      <div className="flex justify-center bg-gray-100">
        <Card className="w-full max-w-xl rounded-lg p-8 shadow-lg">
          <div className="flex items-center gap-4 rounded-md bg-gray-100 px-6 py-4">
            <CoinsIcon className="h-8 w-8 text-gray-800" />
            <p className="text-lg font-bold text-gray-900">Wallet Balance</p>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center">
            <p className="text-6xl font-bold text-gray-800">
              ${walletAmount?.toFixed(2) || 0}
            </p>
            <Button
              className="mt-8 rounded-md bg-blue-500 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-600"
              onClick={() => fetchWalletAmount()}
            >
              <RefreshCcwIcon className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </Card>
      </div>
      <AddwalletModel
        onConfirm={handleAddAmount}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
