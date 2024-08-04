import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { no, image, urllink } = data;

    // Validate input data
    if (typeof no !== 'number' || typeof image !== 'string' || typeof urllink !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid input data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract the base64 string from the image data
    const base64String = image.split(",")[1];
    const imageBuffer = Buffer.from(base64String, "base64");

    const query = "INSERT INTO slides (No, Image, URLLink, CreateDate) VALUES (?, ?, ?, NOW())";
    await pool.query(query, [no, imageBuffer, urllink]);

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
