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
    const data = await request.formData();
    const title = data.get("title") as string;
    const details = data.get("details") as string;
    const imageFile = data.get("image") as File | null;
    const pdfFile = data.get("pdf") as File | null;

    let query = "UPDATE news SET Title = ?, Details = ?, UpdateDate = NOW()";
    const paramsArray: string[] = [title, details];

    // Handle image file upload if provided
    if (imageFile) {
      const imageUUID = `${uuidv4()}.${imageFile.name.split(".").pop()}`;
      const imagePath = path.join(
        process.cwd(),
        "public/Uploads/News/Image",
        imageUUID
      );
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(imagePath, imageBuffer); // Save the image file
      query += ", ImagePath = ?";
      paramsArray.push(`/Uploads/News/Image/${imageUUID}`);
    }

    // Handle PDF file upload if provided
    if (pdfFile) {
      const pdfUUID = `${uuidv4()}.pdf`;
      const pdfPath = path.join(
        process.cwd(),
        "public/Uploads/News/Pdf",
        pdfUUID
      );
      const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
      await fs.writeFile(pdfPath, pdfBuffer); // Save the PDF file
      query += ", PdfPath = ?";
      paramsArray.push(`/Uploads/News/Pdf/${pdfUUID}`);
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
