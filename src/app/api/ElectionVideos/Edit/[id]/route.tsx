import { NextResponse, NextRequest } from "next/server";
import pool from "../../../../db/mysql";

type Params = {
  id: string;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { title, youTubeUrl, details } = await request.json();
  const { id } = params;

  try {
    const [result]: any = await pool.query(
      "UPDATE electionvideos SET Title = ?, YouTubeUrl = ?, Details = ?, UpdateDate = NOW() WHERE Id = ?",
      [title, youTubeUrl, details, id]
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
