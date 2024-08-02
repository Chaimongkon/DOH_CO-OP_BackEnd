import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;

    const query = "DELETE FROM news WHERE Id = (?)";
    await pool.query(query, [id]);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing DELETE request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
