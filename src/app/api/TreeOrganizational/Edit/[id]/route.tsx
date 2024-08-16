import { NextResponse, NextRequest } from "next/server";
import pool from "../../../../db/mysql";

type Params = {
  id: string;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { name, position, priority, type, image } = await request.json();
  const { id } = params;
  console.log("Received image base64:", image);

  try {
    const imageBuffer = Buffer.from(image.split(",")[1], "base64");
    const [result]: any = await pool.query(
      "UPDATE treeorganizational SET Name = ?, Position = ?, Priority = ?, Type = ?, Image = ?, UpdateDate = NOW() WHERE Id = ?",
      [name, position, priority, type, imageBuffer, id]
    );

    console.log("Database update result:", result); // Log the result for debugging

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
