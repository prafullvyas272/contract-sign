import pool from "@/lib/mysql";
import { NextResponse } from "next/server";

export async function GET(req:Request){
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const [result] = await pool.query<any>("SELECT * FROM teams WHERE teams.user_id=?",[id]);
    if(result.length===0)return NextResponse.json({error:"No team found"},{status:404});
    return NextResponse.json(result[0]);
}