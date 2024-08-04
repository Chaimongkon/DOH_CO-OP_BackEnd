import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, details, image, pdf } = data;

    // Validate input data
    if (typeof title !== 'string' || typeof details !== 'string' || typeof image !== 'string' || typeof pdf !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid input data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if image and pdf data are provided
    if (!image || !pdf) {
      return new Response(JSON.stringify({ error: "Missing image or pdf data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert base64 image and pdf to buffer
    const imageBase64 = image.split(",")[1];
    const pdfBase64 = pdf.split(",")[1];

    if (!imageBase64 || !pdfBase64) {
      return new Response(JSON.stringify({ error: "Invalid image or pdf data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const imageBuffer = Buffer.from(imageBase64, "base64");
    const pdfBuffer = Buffer.from(pdfBase64, "base64");

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
