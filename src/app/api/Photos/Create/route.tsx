import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import pool from '../../../db/mysql'; // Adjust the import path based on your project structure

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

// Handle the POST request for uploading photos
export async function POST(request: Request) {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const coverIndex = formData.get('coverIndex') as string;
  const category = formData.get('category') as string;
  const photos = formData.getAll('photos') as File[];

  try {
    const photoPaths: string[] = [];

    for (const photo of photos) {
      const arrayBuffer = await photo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const fileName = uuidv4() + path.extname(photo.name);
      const outputFilePath = path.join(uploadDir, fileName);

      // Save the file to disk
      fs.writeFileSync(outputFilePath, buffer);

      // Resize the image
      await resizeImage(outputFilePath);

      photoPaths.push(`/Uploads/PhotoAlbum/${fileName}`);
    }

    const cover = photoPaths[Number(coverIndex)];

    // Save to the database
    const connection = await pool.getConnection();
    await connection.execute(
        `INSERT INTO photoalbum (Title, Cover, Image, Category, CreateDate) VALUES (?, ?, ?, ?, NOW())`,
        [title || null, cover || null, JSON.stringify(photoPaths) || null, category || null]
      );
      

    connection.release(); // Release the connection back to the pool

    return NextResponse.json({ message: 'Upload successful' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error saving the photos' }, { status: 500 });
  }
}
