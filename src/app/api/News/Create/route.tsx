import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, details, image, pdf } = data;

    if (!image || !pdf) {
      throw new Error("Missing image or pdf data");
    }

    // Convert base64 image and pdf to buffer
    const imageBuffer = Buffer.from(image.split(",")[1], "base64");
    const pdfBuffer = Buffer.from(pdf.split(",")[1], "base64");

    const query = "INSERT INTO news (Title, Details, Image, File, CreateDate) VALUES (?, ?, ?, ?, NOW())";
    await pool.query(query, [title, details, imageBuffer, pdfBuffer]);

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
