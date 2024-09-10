import { NextResponse } from 'next/server';
import pool from '../../../../db/mysql';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), '/public/Uploads/PhotoAlbum');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Utility function to resize images
const resizeImage = async (filePath: string) => {
  const tempOutputPath = `${filePath}-temp`;
  await sharp(filePath)
    .resize(1200, 800)
    .toFile(tempOutputPath);

  // Replace the original file with the resized one
  fs.renameSync(tempOutputPath, filePath);
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
      const formData = await request.formData();
      const image = formData.get('image');
      const index = parseInt(formData.get('index') as string);
  
      if (!(image instanceof File)) {
        return NextResponse.json({ message: 'No image provided' }, { status: 400 });
      }
  
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
  
      const fileName = uuidv4() + path.extname(image.name);
      const outputFilePath = path.join(uploadDir, fileName);
  
      // Save the file to disk
      fs.writeFileSync(outputFilePath, buffer);
  
      // Resize the image
      await resizeImage(outputFilePath);
  
      // Fetch existing image paths from the database
      const connection = await pool.getConnection();
      const [rows] = await connection.query<RowDataPacket[]>('SELECT Image FROM photoalbum WHERE Id = ?', [params.id]);
      connection.release();
  
      if (rows.length === 0) {
        return NextResponse.json({ message: 'Image not found' }, { status: 404 });
      }
  
      const imageRecord = rows[0];
      
      // Ensure the images field exists and is not undefined or null
      const existingImages = imageRecord.Image ? JSON.parse(imageRecord.Image) as string[] : [];
  
      // Replace the image at the specified index
      existingImages[index] = `/Uploads/PhotoAlbum/${fileName}`;
  
      // Update the database with the new image paths
      const [result] = await connection.query<ResultSetHeader>(
        'UPDATE photoalbum SET Image = ? WHERE Id = ?',
        [JSON.stringify(existingImages), params.id]
      );
  
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'Image not updated' }, { status: 404 });
      }
  
      return NextResponse.json({ success: true, newImagePath: `/Uploads/PhotoAlbum/${fileName}` }, { status: 200 });
    } catch (error) {
      console.error('Error processing image upload:', error);
      return NextResponse.json({ message: 'Error uploading images' }, { status: 500 });
    }
  }
  
