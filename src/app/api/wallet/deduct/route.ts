import pool from "@/lib/mysql";
import { NextResponse } from "next/server";
import { createLog } from "../../log/createLog";

interface DEDUCTWALLET {
  id: number;
  amount: number;
}
export async function PUT(req: Request) {
  const body: DEDUCTWALLET = await req.json();
  if (!body.id || !body.amount)
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  const [rows]: any = await pool.query(
    "UPDATE Users SET wallet=wallet-? WHERE id=?",
    [body.amount, body.id],
  );
  const [user]: any = await pool.query("SELECT * FROM Users WHERE id=?", [
    body.id,
  ]);
  if (user?.length)
    createLog({
      log: `Amount ${body.amount}$ deducted from ${user[0]?.name}`,
      userId: body.id,
      type: 3,
      createdBy: body.id,
    });

  return NextResponse.json({
    status: "success",
    message: "Amount added successfully",
  });
}
