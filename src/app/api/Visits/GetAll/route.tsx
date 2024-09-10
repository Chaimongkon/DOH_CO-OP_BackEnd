import { NextResponse } from "next/server";
import pool from "../../../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";

export const dynamic = 'force-dynamic';

export async function GET() {
  let db;
  try {
    db = await pool.getConnection();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const dayQuery = `SELECT SUM(DayCount) AS ToDayCount FROM countwebvisits WHERE DATE(DateTimeStamp) >= ?;`;
    const weekQuery = `SELECT SUM(WeekCount) AS WeekCount FROM countwebvisits WHERE DATE(DateTimeStamp) >= ?;`;
    const monthQuery = `SELECT SUM(MonthCount) AS MonthCount FROM countwebvisits WHERE DATE(DateTimeStamp) >= ?;`;
    const yearQuery = `SELECT SUM(YearCount) AS YearCount FROM countwebvisits WHERE DATE(DateTimeStamp) >= ?;`;

     const [dayResult] = await db.query<RowDataPacket[]>(dayQuery, [today.toISOString().split('T')[0]]);
    const [weekResult] = await db.query<RowDataPacket[]>(weekQuery, [startOfWeek.toISOString().split('T')[0]]);
    const [monthResult] = await db.query<RowDataPacket[]>(monthQuery, [startOfMonth.toISOString().split('T')[0]]);
    const [yearResult] = await db.query<RowDataPacket[]>(yearQuery, [startOfYear.toISOString().split('T')[0]]);

    const visitCounts = {
      todayCount: dayResult[0]?.ToDayCount || 0, // Ensure this matches the column alias in your query
      weekCount: weekResult[0]?.WeekCount || 0,
      monthCount: monthResult[0]?.MonthCount || 0,
      yearCount: yearResult[0]?.YearCount || 0,
    };

    return NextResponse.json(visitCounts);
  } catch (err) {
    console.error('Database error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    if (db) {
      db.release();
    }
  }
}
