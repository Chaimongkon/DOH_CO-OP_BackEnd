import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import pool from "../../../db/mysql";
import sharp from "sharp"; // Import sharp

export async function POST(request: Request) {
  const formData = await request.formData();
  const societyType = formData.get("societyType") as string | null;
  const imageFile = formData.get("image") as File | null;

  if (!societyType || !imageFile) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Create directories if they don't exist
    const uploadsImageDir = path.join(
      process.cwd(),
      "public/Uploads/CoopSociety"
    );
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
    const relativeFilePath = `/Uploads/CoopSociety/${imageUUID}`;

    const query = `
    INSERT INTO cooperativesociety (ImagePath, SocietyType, IsActive, CreateDate) VALUES (?, ?, 1, NOW())
    `;
    await pool.query(query, [relativeFilePath, societyType]);

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
