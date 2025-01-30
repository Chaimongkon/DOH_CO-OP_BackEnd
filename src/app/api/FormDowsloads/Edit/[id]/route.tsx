import { NextResponse, NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import pool from "../../../../db/mysql";

type Params = {
  id: string;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params;

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const typeForm = formData.get("typeForm") as string;
    const typeMember = formData.get("typeMember") as string;
    const pdfFile = formData.get("pdf") as File | null;

    let query =
      "UPDATE formdowsloads SET Title = ?, TypeForm = ?, TypeMember = ?, UpdateDate = NOW()";
    const paramsArray: string[] = [title, typeForm, typeMember];

    // Handle PDF file upload if provided
    if (pdfFile) {
      const pdfUUID = `${uuidv4()}.pdf`;
      const pdfPath = path.join(
        process.cwd(),
        "public/Uploads/FileDownload",
        pdfUUID
      );
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      await fs.writeFile(pdfPath, pdfBuffer); // Save the PDF file
      query += ", FilePath = ?";
      paramsArray.push(`/Uploads/FileDownload/${pdfUUID}`);
    }

    // Complete the query with the ID
    query += " WHERE Id = ?";
    paramsArray.push(id);

    const [result]: any = await pool.query(query, paramsArray);

    return NextResponse.json({
      message: "Update successful",
      updatedSlide: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "Update failed",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
