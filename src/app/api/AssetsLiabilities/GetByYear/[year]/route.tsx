import { NextResponse, NextRequest } from "next/server";
import pool from '../../../../db/mysql';

type Params = {
    id: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const db = await pool.getConnection();
        const query = 'SELECT Year, TitleMonth, PdfFile FROM assetsliabilities WHERE Year = ?';
        const [rows]: [any[], any] = await db.execute(query, [params.id]); // Use params.id to execute query
        db.release();

        // Ensure rows is treated as an array and format the response
        const processedRows = rows.map((row) => {
            let fileBase64 = null;
            // Convert File to base64 if not null
            if (row.File) {
              fileBase64 = Buffer.from(row.File).toString("base64");
            }
      
            return {
              ...row,
              File: fileBase64,
            };
          });

          return NextResponse.json(processedRows, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({
                error: error.message
            }, { status: 500 });
        }
        // Handle non-Error type errors
        return NextResponse.json({
            error: "An unknown error occurred"
        }, { status: 500 });
    }
}
