import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import pool from "../../../db/mysql"; // Adjust the import path based on your project structure

// Define base directory for images
const uploadBaseDir = path.join(process.cwd(), "/public/Uploads/Particles");

// Utility function to ensure directory exists
const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Handle the POST request for uploading photos
export async function POST(request: Request) {
  const formData = await request.formData();
  const category = formData.get("category") as string;
  const photos = formData.getAll("photos") as File[];
  const status = formData.get("status") as string;

  try {
    const folderName = category;

    // Create subdirectory named after the category in the base directory
    const uploadDir = path.join(uploadBaseDir, folderName);

    // Ensure the directory exists
    ensureDirectoryExists(uploadDir);

    const photoPaths: string[] = [];

    for (const photo of photos) {
      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Check for an existing extension and use a default if none is found
      const extension = path.extname(photo.name) || ".webp"; // Use ".png" or any default extension of your choice
      const fileName = uuidv4() + extension;

      const filePath = path.join(uploadDir, fileName);

      // Save the image buffer directly to the specified path
      fs.writeFileSync(filePath, buffer);

      // Save the path relative to the public folder
      photoPaths.push(`/Uploads/Particles/${folderName}/${fileName}`);
    }

    // Save to the database
    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO particles (Category, ImagePath, IsActive, CreateDate) VALUES (?, ?, ?, NOW())`,
      [category || null, JSON.stringify(photoPaths) || null, status]
    );
    connection.release(); // Release the connection back to the pool

    return NextResponse.json({ message: "Upload successful" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error saving the photos" },
      { status: 500 }
    );
  }
}
