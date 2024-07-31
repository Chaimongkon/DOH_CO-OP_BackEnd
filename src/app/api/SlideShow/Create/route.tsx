import { NextResponse, NextRequest } from 'next/server';
import pool from '../../../db/mysql';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        console.log(data)
        const { image } = data; // Assuming the image data is sent as 'slider_image'

        // Your SQL query to insert the image data into the 'tb_slider' table
        const query = 'INSERT INTO tb_slider (slider_image) VALUES (?)';
        await pool.query(query, [image]);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error processing POST request:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
