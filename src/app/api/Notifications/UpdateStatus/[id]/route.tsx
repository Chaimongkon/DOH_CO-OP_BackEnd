import { NextResponse, NextRequest } from "next/server";
import pool from "../../../../db/mysql";

type Params = {
  id: string;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { status } = await request.json();
  const { id } = params;

  try {
    const [result]: any = await pool.query(
      "UPDATE notification SET `IsActive` =? WHERE `Id` =?",
      [status, id]
    );

    return NextResponse.json({
      message: "Update Status successful",
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
