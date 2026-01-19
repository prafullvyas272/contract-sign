import pool from "@/lib/mysql";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user_id = url.searchParams.get("id");

  const [logs] = await pool.query<any>(
    `
        SELECT * FROM Logs WHERE contractId = ? ORDER BY id DESC;
        `,
    [user_id],
  );
  return NextResponse.json(logs);
}
