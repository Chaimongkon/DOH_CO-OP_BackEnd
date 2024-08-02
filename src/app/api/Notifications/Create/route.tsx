import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set desired limit
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { image, urllink } = data;
    const status = false
    // Convert base64 image to buffer
    const imageBuffer = Buffer.from(image.split(",")[1], "base64");

    const query = "INSERT INTO notification (Image, URLLink, IsActive) VALUES (?, ?, ?)";
    await pool.query(query, [imageBuffer, urllink, status]);

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
