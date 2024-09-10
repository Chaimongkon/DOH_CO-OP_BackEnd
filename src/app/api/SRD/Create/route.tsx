import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, typeForm, typeMember, pdf } = data;

    const pdfBuffer = Buffer.from(pdf.split(",")[1], "base64");

    const query = "INSERT INTO statuteregularitydeclare (Title, TypeForm, TypeMember, PdfFile, CreateDate) VALUES (?, ?, ?, ?, NOW())";
    await pool.query(query, [title, typeForm, typeMember, pdfBuffer]);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
