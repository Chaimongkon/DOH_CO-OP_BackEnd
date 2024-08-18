import { NextResponse, NextRequest } from "next/server";
import pool from "../../../db/mysql";

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming form data
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const imageFile = formData.get("image") as Blob | null;
    const pdfFile = formData.get("pdf") as Blob | null;

    // Validate input data
    if (!title || !imageFile || !pdfFile) {
      return NextResponse.json({ error: "Missing title, image, or pdf data" }, { status: 400 });
    }

    // Convert the image and pdf to buffers
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

    // Insert data into the database
    const query = "INSERT INTO businessreport (Title, Image, File, CreateDate) VALUES (?, ?, ?, NOW())";
    await pool.query(query, [title, imageBuffer, pdfBuffer]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
