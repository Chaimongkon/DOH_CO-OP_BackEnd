import { NextResponse } from "next/server";
import pool from '../../../db/mysql';

export async function GET() {
    try {
        const db = await pool.getConnection();
        const query = 'SELECT Id, No, Image, URLLink FROM slides ORDER BY No ASC';
        const [rows]: [any[], any] = await db.execute(query); // Ensure rows is correctly typed
        db.release();

        // Ensure rows is treated as an array
        const formattedRows = rows.map(row => ({
            ...row,
            Image: row.Image.toString('base64')
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
