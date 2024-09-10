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
        DATE(DateTimeStamp) AS Date,  -- Select the actual date
        DATE_FORMAT(DateTimeStamp, '%a') AS DayName,  -- Select the day name
        SUM(DayCount) AS TotalDayCount
      FROM 
        countwebvisits
      WHERE 
        DateTimeStamp >= CURDATE() - INTERVAL 7 DAY
      GROUP BY 
        Date, DayName
      ORDER BY 
        Date ASC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (db) {
      db.release();
    }
  }
}
