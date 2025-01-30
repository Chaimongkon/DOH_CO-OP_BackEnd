import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import pool from "../../../db/mysql";

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const typeForm = formData.get("typeForm") as string | null;
  const typeMember = formData.get("typeMember") as string | null;
  const pdfFile = formData.get("pdf") as File | null;

  if (!title || !typeForm || !typeMember || !pdfFile) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // Create directories if they don't exist
    const uploadsPdfDir = path.join(
      process.cwd(),
      "public/Uploads/SRD"
    );
    await fs.mkdir(uploadsPdfDir, { recursive: true });

    // Save the PDF file
    const pdfUUID = `${uuidv4()}.pdf`;
    const pdfPath = path.join(uploadsPdfDir, pdfUUID);
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await fs.writeFile(pdfPath, pdfBuffer);

    // Save file path in the database
    const relativeFilePath = `/Uploads/SRD/${pdfUUID}`;

    const query = `
    INSERT INTO statuteregularitydeclare (Title, TypeForm, TypeMember, FilePath, CreateDate) VALUES (?, ?, ?, ?, NOW())
    `;
    await pool.query(query, [title, typeForm, typeMember, relativeFilePath]);

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
