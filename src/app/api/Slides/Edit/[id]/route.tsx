import { NextResponse, NextRequest } from "next/server";
import pool from "../../../../db/mysql";

type Params = {
  id: string;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { no, image, urllink  } = await request.json();
  const { id } = params;

  try {
    const imageBuffer = Buffer.from(image.split(",")[1], "base64");
    const [result]: any = await pool.query(
      "UPDATE slides SET No = ?, URLLink = ?, Image = ? WHERE Id = ?",
      [no, urllink, imageBuffer, id]
    );

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
