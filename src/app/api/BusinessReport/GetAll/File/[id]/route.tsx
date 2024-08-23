import { NextResponse, NextRequest } from "next/server";
import pool from "../../../../../db/mysql";
import { RowDataPacket, FieldPacket } from "mysql2";

interface BusinessReportRow extends RowDataPacket {
  File: Buffer | null;
  Title: string; // Add Title to the interface
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  let db;
  try {
    db = await pool.getConnection();
    const query = "SELECT File, Title FROM businessreport WHERE Id = ?";
    const [rows]: [BusinessReportRow[], FieldPacket[]] = await db.execute(query, [id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    const fileBuffer = rows[0].File;
    const title = rows[0].Title;

    if (!fileBuffer) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    const encodedTitle = encodeURIComponent(title);

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodedTitle}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (db) db.release();
  }
}
