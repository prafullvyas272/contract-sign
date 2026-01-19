import pool from "@/lib/mysql";
import { sendMail } from "@/lib/node-mailer";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

interface CreateRequest {
  name: string;
  email: string;
  role: string;
  created_by: number;
  admin_id: number;
}
export async function POST(req: Request) {
  const json: CreateRequest = await req.json();
  console.log(json);
  if (!json.name || !json.email || !json.role)
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 404 },
    );
  const [checkExistingUser] = await pool.query<any>(
    "SELECT * FROM Users WHERE email = ?",
    [json.email],
  );
  if (checkExistingUser.length > 0)
    return NextResponse.json({ error: "User already exists" }, { status: 404 });
  const randomPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(randomPassword, 10);
  const [result] = await pool.query<any>(
    "INSERT INTO Users (name, email, role, isTeamMember,password,is_verified) VALUES (?, ?, ?, ?, ?, ?)",
    [json.name, json.email, json.role, true, hashedPassword, true],
  );
  console.log(result);
  const createdUserId = result.insertId;
  console.log(createdUserId);
  const [createTeam] = await pool.query<any>(
    "INSERT INTO teams (user_id,admin_id,created_by,name,email) VALUES (?, ?,?,?,?)",
    [createdUserId, json.admin_id, json.created_by, json.name, json.email],
  );
  console.log(createTeam);
  await sendMail(
    json.email,
    "You have been added to a team",
    `Please use the following credentials to login: Email: ${json.email}, Password: ${randomPassword}`,
  );

  return NextResponse.json({ message: "Hello World", data: json });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const [result] = await pool.query<any>(
    "SELECT user.id AS user_id,user.name AS userName, user.email As userEmail, teams.id,teams.name,teams.email,created.name AS createdBy, admin.name AS AdminName, admin.id AS adminId FROM teams Left JOIN Users AS user ON teams.user_id=user.id Left JOIN Users as admin On teams.admin_id=admin.id Left JOIN Users as created on teams.created_by=created.id Where teams.admin_id=?",
    [id],
  );
  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const [user] = await pool.query<any>(
    "SELECT user_id FROM teams WHERE id = ?",
    [id],
  );
  if (!user?.length)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  const [updateUser] = await pool.query<any>(
    "UPDATE Users SET is_verified=? WHERE id = ?",
    [false, user[0].user_id],
  );
  const [result] = await pool.query<any>("DELETE FROM teams WHERE id = ?", [
    id,
  ]);
  return NextResponse.json({ message: "Team member deleted successfully" });
}
