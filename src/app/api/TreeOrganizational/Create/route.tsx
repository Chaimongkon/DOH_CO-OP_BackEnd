import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import pool from "../../../db/mysql";
import sharp from "sharp";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const position = formData.get("position") as string;
  const priority = formData.get("priority") as string;
  const type = formData.get("type") as string;
  const imageFile = formData.get("image") as File | null;


  // Check for missing required fields
  if (!name || !position || !priority || !type || !imageFile) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Validate file types for image and PDF
    // Create directories if they don't exist
    const uploadsImageDir = path.join(process.cwd(), "public/Uploads/TreeOrganizational");
    await fs.mkdir(uploadsImageDir, { recursive: true });

    // Determine if the file should be converted to WebP
    const fileExtension = imageFile.name.split(".").pop()?.toLowerCase();
    const isPng = fileExtension === "png";

    // Generate unique name for the file
    const imageUUID = `${uuidv4()}.webp`; // Save as WebP
    const imagePath = path.join(uploadsImageDir, imageUUID);

    // Convert PNG to WebP using sharp, or save the file directly if not a PNG
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    if (isPng) {
      // Use sharp to convert PNG to WebP
      const webpBuffer = await sharp(imageBuffer).webp().toBuffer();
      await fs.writeFile(imagePath, webpBuffer);
    } else {
      // Save non-PNG images as-is (if needed, you can handle other formats similarly)
      await fs.writeFile(imagePath, imageBuffer);
    }

    // Save file path in the database
    const relativeFilePath = `/Uploads/TreeOrganizational/${imageUUID}`;

    // Save file paths in the database
    const query = `
    INSERT INTO treeorganizational (Name, Position, Priority, Type, ImagePath, CreateDate) VALUES (?, ?, ?, ?, ?, NOW())
    `;
    await pool.query(query, [name, position, priority, type, relativeFilePath]);

    // Respond with success
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
