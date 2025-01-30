import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";

// Define the types for the query results
interface NewsRow extends RowDataPacket {
  Id: number;
  DepartmentName: string;
  FilePath: string;
}

interface CountRow extends RowDataPacket {
  total: number;
}

export async function GET(req: NextRequest) {
  const db = await pool.getConnection();
  try {
    // Parse query parameters
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const per_page = parseInt(
      req.nextUrl.searchParams.get("per_page") || "10",
      10
    );
    const search = req.nextUrl.searchParams.get("search");
    const start_idx = (page - 1) * per_page;

    const params: (string | number)[] = [];

    let query = `
    SELECT SQL_CALC_FOUND_ROWS Id, DepartmentName, FilePath FROM electiondepartment
    `;

    // Add search filter if present
    if (search) {
      query += " WHERE DepartmentName LIKE ?";
      params.push("%" + search + "%");
    }


    // Add ordering and pagination with string interpolation for LIMIT
    query += ` ORDER BY Id ASC LIMIT ${start_idx}, ${per_page}`;

    // Execute the query
    const [rows]: [NewsRow[], FieldPacket[]] = await db.execute(query, params);

    // Get the total count of records
    const [counts]: [CountRow[], FieldPacket[]] = await db.query(
      "SELECT FOUND_ROWS() AS total"
    );
    const total = counts[0].total;
    const pageCount = Math.ceil(total / per_page);

    // Return the result
    return NextResponse.json(
      {
        page,
        per_page,
        total,
        pageCount,
        data: rows,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Log the error for debugging
    console.error("Error fetching data:", error.message);

    // Return a 500 error with the message
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  } finally {
    // Ensure the database connection is released
    if (db) db.release();
  }
}

// Make sure this API route is not statically rendered
export const dynamic = "force-dynamic";
