import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";
import fs from "fs";
import path from "path";

function deleteFolderRecursive(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const currentPath = path.join(folderPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        // Recurse into the subdirectory
        deleteFolderRecursive(currentPath);
      } else {
        // Delete file
        fs.unlinkSync(currentPath);
      }
    });
    // Remove the empty folder
    fs.rmdirSync(folderPath);
    console.log(`Folder deleted: ${folderPath}`);
  } else {
    console.warn(`Folder not found: ${folderPath}`);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json();
    const { id } = data;

    // Query to find image paths related to the ID
    const findQuery = "SELECT ImagePath FROM particles WHERE Id = (?)";
    const [rows]: any = await pool.query(findQuery, [id]);

    // Check if the query returns valid paths
    if (rows.length > 0 && rows[0].ImagePath) {
      // Parse the ImagePaths if stored as a stringified array
      const imagePaths = JSON.parse(rows[0].ImagePath);

      // Get the base folder path from one of the image paths
      const folderPath = path.join(
        process.cwd(),
        "public",
        "Uploads",
        "Particles",
        "2566"
      );

      // Delete all files specified in the imagePaths array
      imagePaths.forEach((relativePath: string) => {
        const fullPath = path.join(process.cwd(), relativePath);

        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
            console.log(`File deleted: ${fullPath}`);
          } catch (err) {
            console.error(`Error deleting file: ${fullPath}`, err);
          }
        } else {
          console.warn(`File not found: ${fullPath}`);
        }
      });

      // Delete the folder after the files
      deleteFolderRecursive(folderPath);
    } else {
      console.warn("No image paths found or image paths are not valid.");
    }

    // Delete the entry from the database
    const deleteQuery = "DELETE FROM particles WHERE Id = (?)";
    await pool.query(deleteQuery, [id]);

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
