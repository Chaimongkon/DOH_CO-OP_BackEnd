import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";

export const dynamic = 'force-dynamic';
interface BusinessReportRow extends RowDataPacket {
  Id: number;
  Title: string;
  Image: Buffer | null;
}

export async function GET(req: NextRequest) {
  let db;
  try {
    db = await pool.getConnection();
    const query = "SELECT Id, Title, Image FROM businessreport ORDER BY Id DESC";

    const [rows]: [BusinessReportRow[], FieldPacket[]] = await db.execute(query);

    const processedRows = rows.map((row) => ({
      Id: row.Id,
      Title: row.Title,
      Image: row.Image ? row.Image.toString("base64") : null,
      FileUrl: `/BusinessReport/GetAll/File/${row.Id}`, // URL to access the file
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
