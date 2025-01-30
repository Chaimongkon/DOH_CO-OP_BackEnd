import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import pool from "../../../db/mysql";

export async function POST(request: Request) {
  const formData = await request.formData();

  if (!formData) {
    return NextResponse.json({ error: "Missing form data" }, { status: 400 });
  }

  try {
    // Create directories if they don't exist
    const uploadsPdfDir = path.join(
      process.cwd(),
      "public/Uploads/ElectionDepartment"
    );
    await fs.mkdir(uploadsPdfDir, { recursive: true });

    // Collect file data
    const fileInsertData: Array<[string, string]> = [];

    // Loop through all files in the formData
    for (const entry of formData.entries()) {
      const [key, value] = entry;

      // Check for files that start with "pdf_" (e.g., "pdf_0", "pdf_1", etc.)
      if (key.startsWith("pdf_") && value instanceof File) {
        const pdfFile = value as File;

        // Generate a unique file name for saving
        const pdfUUID = `${uuidv4()}.pdf`;
        const pdfPath = path.join(uploadsPdfDir, pdfUUID);

        // Write the file to the server
        const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
        await fs.writeFile(pdfPath, pdfBuffer);

        // Extract the file name without the .pdf extension
        const originalFileName = path.parse(pdfFile.name).name;

        // Construct relative file path
        const relativeFilePath = `/Uploads/ElectionDepartment/${pdfUUID}`;

        // Push data to insert into database
        fileInsertData.push([originalFileName, relativeFilePath]);
      }
    }

    // Insert all file data into the database
    if (fileInsertData.length > 0) {
      const query = `
        INSERT INTO electiondepartment (DepartmentName, FilePath, CreateDate)
        VALUES ${fileInsertData
          .map(() => `(?, ?, NOW())`)
          .join(", ")};`;
      const values = fileInsertData.flat();
      await pool.query(query, values);
    }

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
