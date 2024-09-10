import { NextResponse } from 'next/server';
import pool from '../../../db/mysql';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: Request) {
  try {
    const { id, index } = await request.json();

    // Fetch the current image paths from the database
    const connection = await pool.getConnection();
    const [rows] = await connection.query<any[]>(
      'SELECT Image FROM photoalbum WHERE Id = ?',
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    const images = JSON.parse(rows[0].Image) as string[];
    const imagePath = images[index];

    if (!imagePath) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    // Remove the image file from the filesystem
    const filePath = path.join(process.cwd(), 'public', imagePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove the image path from the array and update the database
    images.splice(index, 1);

    const [updateResult] = await connection.query<any>(
      'UPDATE photoalbum SET Image = ? WHERE Id = ?',
      [JSON.stringify(images), id]
    );

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({ message: 'Failed to update image list' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error deleting image' }, { status: 500 });
  }
}
