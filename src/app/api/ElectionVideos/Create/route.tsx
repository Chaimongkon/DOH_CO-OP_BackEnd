import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, youTubeUrl, details } = data;

    // Validate input data
    if (
      typeof title !== "string" ||
      typeof youTubeUrl !== "string" ||
      typeof details !== "string"
    ) {
      return new Response(JSON.stringify({ error: "Invalid input data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract the base64 string from the image data

    const query =
      "INSERT INTO electionvideos (Title, YouTubeUrl, Details, CreateDate) VALUES (?, ?, ?, NOW())";
    await pool.query(query, [title, youTubeUrl, details]);

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
