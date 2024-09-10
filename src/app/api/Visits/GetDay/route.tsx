import { NextResponse } from "next/server";
import pool from "../../../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";

export const dynamic = 'force-dynamic';

export async function GET() {
  let db;
  try {
    db = await pool.getConnection();

    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(`
      SELECT 
          HOUR(DateTimeStamp) AS Hour,
          SUM(DayCount) AS TotalVisits
      FROM 
          countwebvisits
      WHERE 
          DateTimeStamp >= CURDATE() AND DateTimeStamp < CURDATE() + INTERVAL 1 DAY
      GROUP BY 
          HOUR(DateTimeStamp)
      ORDER BY 
          Hour;
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) {
      db.release();
    }
  }
}
