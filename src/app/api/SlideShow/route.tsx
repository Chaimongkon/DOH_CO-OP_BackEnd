import { NextResponse } from "next/server";
import pool from '../../db/mysql';

export async function GET() {
    try {
        const db = await pool.getConnection();
        const query = 'SELECT slider_id, slider_image FROM tb_slider ORDER BY slider_no ASC';
        const [rows]: [any[], any] = await db.execute(query); // Ensure rows is correctly typed
        db.release();

        // Ensure rows is treated as an array
        const formattedRows = rows.map(row => ({
            ...row,
            slider_image: row.slider_image.toString('base64')
        }));

        return NextResponse.json(formattedRows);

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
