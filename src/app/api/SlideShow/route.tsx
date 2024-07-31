import { NextResponse } from "next/server";
import pool from '../../db/mysql'

export async function GET() {
    try {
        const db = await pool.getConnection()
        const query = 'SELECT * FROM tb_slider ORDER BY slider_no ASC'
        const [rows] = await db.execute(query)
        db.release()
        
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.json({
            error: error
        }, { status: 500 })
    }
}