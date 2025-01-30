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
        const query = 'SELECT Id, Title, YouTubeUrl, Details FROM electionvideos WHERE Id = ?';
        const [rows]: [any[], any] = await db.execute(query, [params.id]);
        db.release();

        if (rows.length === 0) {
            return NextResponse.json({ message: "Video not found" }, { status: 404 });
        }

        const video = rows[0];
        return NextResponse.json(video, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({
                error: error.message
            }, { status: 500 });
        }
        return NextResponse.json({
            error: "An unknown error occurred"
        }, { status: 500 });
    }
}
