import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import pool from "../../../db/mysql";

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const details = formData.get("details") as string | null;
  const imageFile = formData.get("image") as File | null;
  const pdfFile = formData.get("pdf") as File | null;

  // Check for missing required fields
  if (!title || !imageFile || !pdfFile) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Validate file types for image and PDF
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const validPdfType = "application/pdf";

    if (!validImageTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Invalid image file type" },
        { status: 400 }
      );
    }

    if (pdfFile.type !== validPdfType) {
      return NextResponse.json(
        { error: "Invalid PDF file type" },
        { status: 400 }
      );
    }

    // Create directories if they don't exist
    const uploadsImageDir = path.join(
      process.cwd(),
      "public/Uploads/News/Image"
    );
    const uploadsPdfDir = path.join(process.cwd(), "public/Uploads/News/Pdf");
    await fs.mkdir(uploadsImageDir, { recursive: true });
    await fs.mkdir(uploadsPdfDir, { recursive: true });

    // Save the image file
    const imageUUID = `${uuidv4()}.${imageFile.name.split(".").pop()}`;
    const imagePath = path.join(uploadsImageDir, imageUUID);
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(imagePath, imageBuffer);

    // Save the PDF file
    const pdfUUID = `${uuidv4()}.pdf`;
    const pdfPath = path.join(uploadsPdfDir, pdfUUID);
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await fs.writeFile(pdfPath, pdfBuffer);

    // Save file paths in the database
    const query = `
      INSERT INTO news (Title, Details, ImagePath, PdfPath, CreateDate)
      VALUES (?, ?, ?, ?, NOW())
    `;
    await pool.query(query, [
      title,
      details,
      `/Uploads/News/Image/${imageUUID}`,
      `/Uploads/News/Pdf/${pdfUUID}`,
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
