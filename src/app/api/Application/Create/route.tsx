import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { number, image, applicationMainType, applicationType } = data;

    const imgBuffer = Buffer.from(image.split(",")[1], "base64");

    const query = "INSERT INTO application (ImageNumber, Image, ApplicationMainType, ApplicationType, CreateDate) VALUES (?, ?, ?, ?, NOW())";
    await pool.query(query, [number, imgBuffer, applicationMainType, applicationType]);

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
