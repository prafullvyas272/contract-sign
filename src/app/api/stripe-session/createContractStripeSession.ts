"use server";
import { env } from "@/env";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const createContractStripeSession = async ({
  quantity,
  name,
}: {
  quantity: number;
  name: string;
}) => {
  try {
    // const redirectURL =
    //   process.env.NODE_ENV === "development"
    //     ? "http://localhost:3000"
    //     : env.NEXT_PUBLIC_APP_URL;
    const redirectURL = env.NEXT_PUBLIC_APP_URL;

    const transformedItem = {
      price_data: {
        currency: "usd",
        product_data: {
          name: name,
        },
        unit_amount: quantity * 100,
      },
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [transformedItem],
      mode: "payment",
      success_url: `${redirectURL}/dashboard/contracts/new?payment_status=success&session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirectURL}/dashboard/contracts/new?payment_status=cancel&session={CHECKOUT_SESSION_ID}`,
    });

    if (session?.id) {
      return {
        isSuccess: true,
        message: "SUCCESS",
        data: { id: session?.id },
      };
    } else {
      return {
        isSuccess: false,
        message: "ERROR",
        data: null,
      };
    }
  } catch (error: any) {
    return {
      isSuccess: false,
      message: error.message,
      data: null,
    };
  }
};
export const retrieveStripeSession = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session) {
      return {
        isSuccess: true,
        message: "SUCCESS",
        data: {
          amount_total: session.amount_total / 100, // Convert amount to dollars
          payment_status: session.payment_status,
        },
      };
    } else {
      return {
        isSuccess: false,
        message: "Session not found",
        data: null,
      };
    }
  } catch (error: any) {
    return {
      isSuccess: false,
      message: error.message,
      data: null,
    };
  }
};
