import { callScheduler } from "@/server/cron";
import { NextResponse } from "next/server";

callScheduler();

export function GET() {
  return NextResponse.json({ status: "Cron job endpoint." });
}
