import { NextResponse } from "next/server";
import pool from "../../../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";

export const dynamic = 'force-dynamic';

interface ServiceRow extends RowDataPacket {
  Id: number;
  ImageNumber: number;
  ImagePath: string;
  ApplicationMainType: string;
  ApplicationType: string;
}

export async function GET() {
  let db;
  try {
    db = await pool.getConnection();
    const query = "SELECT Id, ImageNumber, ImagePath, ApplicationMainType, ApplicationType FROM application ORDER BY Id ASC";
    const [rows]: [ServiceRow[], FieldPacket[]] = await db.execute(query);

    // Process the rows to convert the Image field to base64 string
    const processedRows = rows.map((row) => ({
      ...row,
    }));

    return NextResponse.json(processedRows, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    if (db) db.release();
  }
}

