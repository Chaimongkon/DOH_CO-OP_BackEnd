import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import pool from "../../../db/mysql"; // Adjust this path based on your project structure

// Define base directory for images
const uploadBaseDir = path.join(process.cwd(), "/public/Uploads/Particles");

// Utility function to ensure directory exists
const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Handle the POST request for adding an image
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const imageFile = formData.get("image") as File;

    if (!id || !imageFile) {
      return NextResponse.json({ message: "Invalid ID or image" }, { status: 400 });
    }

    // Retrieve the category or path from the database based on the provided ID
    const connection = await pool.getConnection();
    const [rows] = await connection.query<any[]>(
      `SELECT Category FROM particles WHERE ID = ?`,
      [id]
    );
    connection.release();

    // Check if rows is an array and has results
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: "ID not found" }, { status: 404 });
    }

    const { Category } = rows[0];
    const uploadDir = path.join(uploadBaseDir, Category);

    // Ensure the directory exists
    ensureDirectoryExists(uploadDir);

    // const arrayBuffer = await imageFile.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);
    // const fileName = uuidv4() + path.extname(imageFile.name);
    // const filePath = path.join(uploadDir, fileName);

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Check for an existing extension and use a default if none is found
    const extension = path.extname(imageFile.name) || ".webp"; // Use ".png" or any default extension of your choice
    const fileName = uuidv4() + extension;
    
    const filePath = path.join(uploadDir, fileName);
    
    // Save the image buffer directly to the specified path
    fs.writeFileSync(filePath, buffer);

    // Relative path to be stored in the database
    const relativePath = `/Uploads/Particles/${Category}/${fileName}`;

    // Update the database with the new image path
    const connection2 = await pool.getConnection();
    await connection2.execute(
      `UPDATE particles SET ImagePath = JSON_ARRAY_APPEND(ImagePath, '$', ?) WHERE ID = ?`,
      [relativePath, id]
    );
    connection2.release();

    return NextResponse.json({ success: true, newImagePath: relativePath }, { status: 200 });
  } catch (error) {
    console.error("Error adding image:", error);
    return NextResponse.json({ message: "Error adding the image" }, { status: 500 });
  }
}
