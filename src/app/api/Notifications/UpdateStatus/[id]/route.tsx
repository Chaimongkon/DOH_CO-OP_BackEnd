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
      "UPDATE notification SET `IsActive` = ? WHERE `Id` = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "No record updated. Check if the ID exists.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "OK",
      },
      { status: 200 }
    );
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
