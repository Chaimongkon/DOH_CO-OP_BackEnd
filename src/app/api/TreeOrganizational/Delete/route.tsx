import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import pool from "../../../db/mysql";

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;

    // Fetch the file paths for the image from the database
    const querySelect = "SELECT ImagePath FROM treeorganizational WHERE Id = ?";
    const [rows]: any = await pool.query(querySelect, [id]);

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ error: "Record not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { ImagePath } = rows[0];

    // Delete the image file from the filesystem
    if (ImagePath) {
      const imagePath = path.join(process.cwd(), "public", ImagePath);

      // Debug: Check if the file exists
      try {
        await fs.access(imagePath); // Check if the file exists
        // console.log(`File found: ${imagePath}, proceeding to delete.`);

        // Proceed to delete the file
        await fs.unlink(imagePath);
        // console.log(`File deleted successfully: ${imagePath}`);
      } catch (fileError) {
        console.error(`Error accessing/deleting file: ${imagePath}`, fileError);
        // Continue, even if the file does not exist or deletion fails
      }
    }

    // Delete the record from the database
    const queryDelete = "DELETE FROM treeorganizational WHERE Id = ?";
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
