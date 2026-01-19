import pool from "@/lib/mysql";
import { NextResponse } from "next/server";
import { retrieveStripeSession } from "./createWalletSession";
import { createLog } from "../log/createLog";

//GET Wallet amount
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id)
    return NextResponse.json({ status: "error", message: "No id provided" });
  const [rows]: any = await pool.query("SELECT * FROM Users WHERE id=?", [id]);
  if (rows.length === 0)
    return NextResponse.json({ status: "error", message: "No user found" });
  return NextResponse.json({ status: "success", wallet: rows[0]?.wallet });
}

//POST Add amount to wallet
export async function POST(req: Request) {
  const form = await req.json();
  const sessionId = form.sessionId;
  const id = form.id;

  if (!sessionId || !id)
    return NextResponse.json({
      status: "error",
      message: "No sessionId provided",
    });
  const stripeSession = await retrieveStripeSession(sessionId);
  if (!stripeSession.isSuccess) {
    return NextResponse.json({
      status: "error",
      message: stripeSession.message,
    });
  }
  const Stripeamount = stripeSession.data?.amount_total;

  if (typeof Stripeamount !== "number" || !id) {
    return NextResponse.json({
      status: "error",
      message: "Invalid amount or id",
    });
  }

  const [rows]: any = await pool.query(
    "UPDATE Users SET wallet=wallet+? WHERE id=?",
    [Stripeamount, id],
  );
  const [user]: any = await pool.query("SELECT * FROM Users WHERE id=?", [id]);
  if (user?.length)
    createLog({
      log: `Amount ${Stripeamount}$ added to ${user[0]?.name}`,
      userId: id,
      type: 4,
      createdBy: id,
    });
  return NextResponse.json({
    status: "success",
    message: "Amount added successfully",
  });
}
