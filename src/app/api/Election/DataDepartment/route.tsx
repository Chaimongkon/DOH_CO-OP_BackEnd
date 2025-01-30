import { NextRequest, NextResponse } from "next/server";
import pool from "../../../db/mysql"; // Assuming you have db connection

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  try {
    const [rows] = await pool.query(`
    SELECT DISTINCT Department FROM election ORDER BY Department
    `);

    return NextResponse.json(rows, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch election data" },
      {
        status: 500,
      }
    );
  }
};
