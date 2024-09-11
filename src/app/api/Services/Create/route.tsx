import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, maintype, subcategories, image } = data;

    const imgBuffer = Buffer.from(image.split(",")[1], "base64");

    const query = "INSERT INTO services (Title, MainType, Subcategories, Image, CreateDate) VALUES (?, ?, ?, ?, NOW())";
    await pool.query(query, [title, maintype, subcategories, imgBuffer]);

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
