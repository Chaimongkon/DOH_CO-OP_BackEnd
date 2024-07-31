import { NextResponse, NextRequest } from 'next/server';
import pool from '../../../db/mysql';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { no, image, url } = await request.json();

    // Decode the base64 image
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate a unique file name
    const fileName = `Slides_${Date.now()}.png`; // or .jpg depending on your image type
    const filePath = path.join(process.cwd(), 'public', 'Uploads', 'Slides', fileName);

    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save the file to the directory
    fs.writeFileSync(filePath, buffer);

    // Insert into the database
    const query = 'INSERT INTO tb_slider (slider_no, slider_image, slider_url) VALUES (?, ?, ?)';
    const values = [no, image, url];
console.log(values)
    await pool.query(query, values);

    return NextResponse.json({ message: 'Slider inserted successfully' });
  } catch (error) {
    console.error('Error inserting slider:', error);
    return NextResponse.json({ error: 'Failed to insert slider' }, { status: 500 });
  }
}
