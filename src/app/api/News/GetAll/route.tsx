import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";

// Define the types for the query results
interface NewsRow extends RowDataPacket {
  Title: string;
  Details: string;
  Image: Buffer | null;
  File: Buffer | null;
}

interface CountRow extends RowDataPacket {
  total: number;
}

export async function GET(req: NextRequest) {
  const db = await pool.getConnection();
  try {
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const per_page = parseInt(req.nextUrl.searchParams.get('per_page') || '10');
    const search = req.nextUrl.searchParams.get('search');
    const start_idx = (page - 1) * per_page;
    const params: (string | number)[] = [];

    let query = `
      SELECT SQL_CALC_FOUND_ROWS Id, Title, Details, Image, File
      FROM news
    `;

    if (search) {
      query += " WHERE Title LIKE ?";
      params.push('%' + search + '%');
    }
    query += " ORDER BY Id DESC LIMIT ?, ?";
    params.push(start_idx, per_page);

    const [rows]: [NewsRow[], FieldPacket[]] = await db.execute(query, params);

    const [counts]: [CountRow[], FieldPacket[]] = await db.query("SELECT FOUND_ROWS() AS total");
    const total = counts[0].total;
    const pageCount = Math.ceil(total / per_page);

    // Process the rows to convert the Image and File fields to base64 strings
    const processedRows = rows.map((row) => {
      return {
        ...row,
        Image: row.Image ? Buffer.from(row.Image).toString("base64") : null,
        File: row.File ? Buffer.from(row.File).toString("base64") : null,
      };
    });

    return NextResponse.json({
      page,
      per_page,
      total,
      pageCount,
      data: processedRows,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    db.release();
  }
}
