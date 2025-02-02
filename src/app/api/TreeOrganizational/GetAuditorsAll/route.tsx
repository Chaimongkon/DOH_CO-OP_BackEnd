import { NextResponse } from "next/server";
import pool from "../../../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";

export const dynamic = 'force-dynamic';
// Define the types for the query results
interface SlideRow extends RowDataPacket {
  Id: number;
  Name: string;
  Position: string;
  Priority: string;
  Type: string;
  Image: Buffer;
}

export async function GET() {
  let db;
  try {
    db = await pool.getConnection();
    const query = "SELECT Id, Name, Position, Priority, Type, ImagePath FROM treeorganizational WHERE Type = 'ผู้ตรวจสอบบัญชีและผู้ตรวจสอบกิจการ' ORDER BY Id ASC";
    const [rows]: [SlideRow[], FieldPacket[]] = await db.execute(query);

    // Process the rows to convert the Image field to base64 string
    const processedRows = rows.map((row) => ({
      ...row,
      Image: row.Image ? Buffer.from(row.Image).toString('base64') : null,
    }));

    return NextResponse.json(processedRows, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    if (db) db.release();
  }
}
