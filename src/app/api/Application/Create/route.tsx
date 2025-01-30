import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import pool from "../../../db/mysql";
import sharp from "sharp";

export async function POST(request: Request) {
  const formData = await request.formData();
  const number = formData.get("number") as string;
  const applicationMainType = formData.get("applicationMainType") as string;
  const applicationType = formData.get("applicationType") as string;
  const imageFile = formData.get("image") as File | null;

  // Check for missing required fields
  if (!number || !applicationMainType || !applicationType || !imageFile) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Define the base upload directory for Services
    const uploadsImageDir = path.join(process.cwd(), "public/Uploads/Application");

    // Use `applicationType` as the folder name
    const folderName = applicationType;
    const uploadDir = path.join(uploadsImageDir, folderName);

    // Create the applicationType folder if it does not exist
    await fs.mkdir(uploadDir, { recursive: true });

    // Determine if the file should be converted to WebP
    const fileExtension = imageFile.name.split(".").pop()?.toLowerCase();
    const isPng = fileExtension === "png";

    // Generate unique name for the file
    const imageUUID = `${number}-${Date.now()}.webp`; // Include `number` and timestamp for uniqueness
    const imagePath = path.join(uploadDir, imageUUID);

    // Convert PNG to WebP using sharp, or save the file directly if not a PNG
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    if (isPng) {
      // Use sharp to convert PNG to WebP
      const webpBuffer = await sharp(imageBuffer).webp().toBuffer();
      await fs.writeFile(imagePath, webpBuffer);
    } else {
      // Save non-PNG images as-is
      await fs.writeFile(imagePath, imageBuffer);
    }

    // Save the relative file path to the database
    const relativeFilePath = `/Uploads/Application/${folderName}/${imageUUID}`;

    // Database query to save the file path and other data
    const query = `
    INSERT INTO application (ImageNumber, ImagePath, ApplicationMainType, ApplicationType, CreateDate) VALUES (?, ?, ?, ?, NOW())
    `;
    await pool.query(query, [
      number,
      relativeFilePath,
      applicationMainType,
      applicationType,
    ]);

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
