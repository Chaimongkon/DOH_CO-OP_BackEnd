import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { no, image, urllink } = data;
console.log(data)
    const query = "INSERT INTO slides (No, Image, URLLink) VALUES (?,?,?)";
    await pool.query(query, [no, image, urllink]);

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