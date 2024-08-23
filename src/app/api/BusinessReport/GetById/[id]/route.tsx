import { NextRequest } from "next/server";
import pool from '../../../../db/mysql';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

type Params = {
    id: string;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const db = await pool.getConnection();
        const query = 'SELECT Id, Title, Image, File FROM businessreport WHERE Id = ?';
        const [rows]: [any[], any] = await db.execute(query, [params.id]);
        db.release();

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: "Record not found" }), { status: 404 });
        }

        const row = rows[0];

        let fileUrl = null;
        let imageUrl = null;

        // Handling the PDF file
        if (row.File) {
            try {
                const tempFileName = `${uuidv4()}.pdf`;
                const publicFilePath = path.join(process.cwd(), 'public/Uploads/PDF/', tempFileName);
                await fs.writeFile(publicFilePath, row.File);
                fileUrl = `/Uploads/PDF/${tempFileName}`;

                console.log("Public file path:", publicFilePath);
                console.log("File URL:", fileUrl);
            } catch (error) {
                console.error("Error writing or serving the file:", error);
                return new Response(JSON.stringify({ error: "Error processing file" }), { status: 500 });
            }
        }

        // Handling the image file
        if (row.Image) {
            try {
                const tempImageName = `${uuidv4()}.webp`; // Assuming the image is in JPEG format
                const publicImagePath = path.join(process.cwd(), 'public/Uploads/Image/', tempImageName);
                await fs.writeFile(publicImagePath, row.Image);
                imageUrl = `/Uploads/Image/${tempImageName}`;

                console.log("Public image path:", publicImagePath);
                console.log("Image URL:", imageUrl);
            } catch (error) {
                console.error("Error writing or serving the image:", error);
                return new Response(JSON.stringify({ error: "Error processing image" }), { status: 500 });
            }
        }

        // Return the Title, Image URL, and File URL in the response
        return new Response(JSON.stringify({
            Id: row.Id,
            Title: row.Title,
            Image: imageUrl,
            File: fileUrl,
        }), {
            headers: {
                'Content-Type': 'application/json',
            },
            status: 200
        });

    } catch (error) {
        console.error("Unhandled error:", error);
        return new Response(JSON.stringify({ error: "An unknown error occurred" }), { status: 500 });
    }
}
