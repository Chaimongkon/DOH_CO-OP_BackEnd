import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import pool from "../../../db/mysql";

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;

    // Fetch the file paths for the image and PDF from the database
    const querySelect = "SELECT FilePath FROM statuteregularitydeclare WHERE Id = ?";
    const [rows]: any = await pool.query(querySelect, [id]); // Correctly destructure the result set

    if (!rows || rows.length === 0) {
      // Ensure that rows is not empty
      return new Response(JSON.stringify({ error: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { FilePath } = rows[0]; // Access the first row

    // Delete the image and PDF files from the filesystem
    try {
      if (FilePath) {
        const filePathFull = path.join(process.cwd(), "public", FilePath); // Resolve full PDF path
        await fs.unlink(filePathFull ); // Remove the PDF file
      }
    } catch (fileError) {
      console.error("Error deleting files:", fileError);
      // Continue with deletion even if file removal fails
    }

    // Delete the record from the database
    const queryDelete = "DELETE FROM statuteregularitydeclare WHERE Id = ?";
    await pool.query(queryDelete, [id]);

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
