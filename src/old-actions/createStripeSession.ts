"use server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async ({
  quantity,
  name,
}: {
  quantity: number;
  name: string;
}) => {
  try {
    const redirectURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://dollarsignclub.com";

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
      success_url:
        redirectURL + "/dashboard/contracts/new?payment_status=success",
      cancel_url:
        redirectURL + "/dashboard/contracts/new?payment_status=cancel",
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
