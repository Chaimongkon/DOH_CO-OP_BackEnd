import { NextResponse, NextRequest } from "next/server";
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
    const data = await request.json();
    const { title, details, image, pdf } = data;

    let query = "UPDATE news SET Title = ?, Details = ?, UpdateDate = NOW()";
    const paramsArray: (string | Buffer)[] = [title, details];

    if (image) {
      const imageBuffer = Buffer.from(image.split(",")[1], "base64");
      query += ", Image = ?";
      paramsArray.push(imageBuffer);
    }

    if (pdf) {
      const pdfBuffer = Buffer.from(pdf.split(",")[1], "base64");
      query += ", File = ?";
      paramsArray.push(pdfBuffer);
    }

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
