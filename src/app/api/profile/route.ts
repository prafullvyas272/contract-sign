import pool from "@/lib/mysql";
import { NextResponse } from "next/server";

interface UpdateProfile{
    name:string;
    id:string;

}
export async function PUT(req:Request){
  const json = await req.json();
  if (!json.id || !json.name)
    return NextResponse.json({ error: "Fill required field" }, { status: 404 });
  const [result] = await pool.query<any>(
    " UPDATE Users SET name = ? WHERE id = ?",
    [json.name,json.id],
  );
  console.log(result)
  return NextResponse.json({ message: "User updated successfully" });
}

export async function GET(req:Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const [result]= await pool.query<any>("SELECT * FROM Users WHERE id=?",[id]);
    if(result.length)
    return NextResponse.json(result[0]);
return NextResponse.json({ error: "User not found" }, { status: 404 });
    
}