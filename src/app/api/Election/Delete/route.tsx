import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export async function DELETE(request: NextRequest) {
  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();

    // Delete all rows from the election table
    const query = "DELETE FROM election";
    await connection.query(query); // Execute the query to delete all records

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
  } finally {
    // Ensure the connection is released back to the pool
    if (connection) connection.release();
  }
}
