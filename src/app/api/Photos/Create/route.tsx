import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import pool from "../../../db/mysql"; // Adjust the import path based on your project structure

// Define base directory for resized images
const uploadBaseDir = path.join(process.cwd(), "/public/Uploads/PhotoAlbum");

// Utility function to ensure directory exists
const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Handle the POST request for uploading photos
export async function POST(request: Request) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const coverIndex = formData.get("coverIndex") as string;
  const category = formData.get("category") as string;
  const photos = formData.getAll("photos") as File[];

  try {
    const folderName = uuidv4();

    // Create subdirectory named after the title in the base directory
    const uploadDir = path.join(uploadBaseDir, folderName);

    // Ensure the directory exists
    ensureDirectoryExists(uploadDir);

    const resizedPhotoPaths: string[] = [];

    for (const photo of photos) {
      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileName = uuidv4() + path.extname(photo.name);

      // Path for the resized image
      const resizedFilePath = path.join(uploadDir, fileName);

      // Resize the image directly from the buffer and save it to the final path
      await sharp(buffer).resize(1200, 800).toFile(resizedFilePath);

      // Save the path relative to the public folder
      resizedPhotoPaths.push(`/Uploads/PhotoAlbum/${folderName}/${fileName}`);
    }

    const cover = resizedPhotoPaths[Number(coverIndex)];

    // Save to the database
    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO photoalbum (Title, Cover, Image, Category, CreateDate) VALUES (?, ?, ?, ?, NOW())`,
      [
        title || null,
        cover || null,
        JSON.stringify(resizedPhotoPaths) || null,
        category || null,
      ]
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
