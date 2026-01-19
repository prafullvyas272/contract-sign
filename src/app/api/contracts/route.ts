import pool from "@/lib/mysql";
import { NextResponse } from "next/server";

export async function GET(req:Request){
    const url= new URL(req.url);
    const user_id=url.searchParams.get("id");
    const [results] = await pool.query<any>(
        `
        SELECT 
            C.*,
            CASE 
              WHEN S.total_signatures IS NULL THEN 0
              WHEN S.signed_count = S.total_signatures THEN 2
              WHEN S.signed_count > 0 THEN 1
              ELSE 0
            END AS status
        FROM Contracts C
        LEFT JOIN (
          SELECT 
            contract_id,
            COUNT(*) AS total_signatures,
            SUM(CASE WHEN status = 'signed' THEN 1 ELSE 0 END) AS signed_count
          FROM Signatures
          GROUP BY contract_id
        ) S ON C.id = S.contract_id
        WHERE C.user_id = ?
        ORDER BY C.id DESC;
        `,
        [user_id] 
      );
      return NextResponse.json(results);
      
    
}
export async function DELETE(req:Request){
    const url= new URL(req.url);
    const id=url.searchParams.get("id");
    const [signatures] = await pool.query<any>(
      `
        DELETE FROM 
            Signatures 
        WHERE 
            contract_id = ?;
        `,
      [id],
    );
    const [results] = await pool.query<any>(
        `
        DELETE FROM 
            Contracts 
        WHERE 
            id = ?;
        `,
        [id] 
      );
      return NextResponse.json({ message: "Contract deleted" });
}