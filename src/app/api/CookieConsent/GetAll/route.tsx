import { NextResponse } from "next/server";
import pool from "../../../db/mysql";

export const dynamic = 'force-dynamic';

export async function GET() {
  let db;
  try {
    db = await pool.getConnection();
    const query = "SELECT Id, UserId, ConsentStatus, ConsentDate, CookieCategories, IpAddress, UserAgent FROM cookieconsents ORDER BY Id DESC";
    
    // Execute the query and get the result
    const [rows] = await db.query(query);

    // Return the result as a JSON response
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
