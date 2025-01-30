import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";
import path from "path";

export const dynamic = 'force-dynamic';

// Define the types for the query results
interface HomeStatusRow extends RowDataPacket {
  Id: number;
  Status: string | null;
  Remark: string;
}

export async function GET(req: NextRequest) {
  let db;
  try {
    db = await pool.getConnection();
    const query = "SELECT Id, Status, Remark FROM statushome ORDER BY Id ASC";

    const [rows]: [HomeStatusRow[], FieldPacket[]] = await db.execute(query);

    // Process the rows to return the full URL for the PDF file path
    const processedRows = rows.map((row) => ({
      ...row,
    }));

    return NextResponse.json(
      {
        data: processedRows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) db.release();
  }
}
