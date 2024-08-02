import { NextResponse } from "next/server";
import pool from "../../../db/mysql";

export async function GET() {
  try {
    const db = await pool.getConnection();
    const query = "SELECT Id, Image, URLLink, IsActive FROM notification ORDER BY Id ASC";
    const [rows]: [any[], any] = await db.execute(query); // Ensure rows is correctly typed
    db.release();

    // Process the rows to convert the Image field to base64 string
    const processedRows = rows.map((row) => ({
      ...row,
      Image: Buffer.from(row.Image).toString('base64'), // Convert BLOB to base64
    }));

    return NextResponse.json(processedRows, { status: 200 });
  } catch (error: unknown) {
    // ... (error handling logic remains the same)
  }
}
