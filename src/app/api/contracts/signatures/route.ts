import pool from "@/lib/mysql";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const [results] = await pool.query(`
        SELECT s.*
        FROM Signatures s
        WHERE s.contract_id = ?
        `, [id]);
    return NextResponse.json(results);
}