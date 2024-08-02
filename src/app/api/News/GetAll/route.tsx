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
  try {
    const db = await pool.getConnection();
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
    const per_page = parseInt(req.nextUrl.searchParams.get('per_page') || '10');
    const search = req.nextUrl.searchParams.get('search');
    const start_idx = (page - 1) * per_page;
    const params: (string | number)[] = [];

    let query = "SELECT Id, Title, Details, Image, File FROM news";
    if (search) {
      query += " WHERE Title LIKE ?";
      params.push('%' + search + '%');
    }
    query += " ORDER BY Id DESC";
    query += " LIMIT ?, ?";
    params.push(start_idx);
    params.push(per_page);

    const [rows, fields]: [NewsRow[], FieldPacket[]] = await db.execute(query, params);

    const [counts, countFields]: [CountRow[], FieldPacket[]] = await db.execute("SELECT COUNT(Id) AS total FROM news");
    const total = counts[0].total;
    const pageCount = Math.ceil(total / per_page);

    db.release();

    // Process the rows to convert the Image and File fields to base64 strings
    const processedRows = rows.map((row) => {
      let imageBase64 = null;
      let fileBase64 = null;

      // Convert Image to base64 if not null
      if (row.Image) {
        imageBase64 = Buffer.from(row.Image).toString("base64");
      }

      // Convert File to base64 if not null
      if (row.File) {
        fileBase64 = Buffer.from(row.File).toString("base64");
      }

      return {
        ...row,
        Image: imageBase64,
        File: fileBase64,
      };
    });

    return NextResponse.json({
      page: page,
      per_page: per_page,
      total: total,
      pageCount: pageCount,
      data: processedRows,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
