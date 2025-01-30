import { NextRequest, NextResponse } from "next/server";
import { IncomingForm, File as FormidableFile } from "formidable";
import fs from "fs";
import path from "path";
import pool from "../../../db/mysql";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";
import { IncomingMessage } from "http";

const uploadDir = path.join(process.cwd(), "/Uploads/PhotoAlbum");
const uploadDir2 = "C:/FrontEndWeb/Uploads/PhotoAlbum"; // Update the path as per your environment

// Ensure both upload directories exist
[uploadDir, uploadDir2].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Utility function to resize images
const resizeImage = async (filePath: string): Promise<void> => {
  const tempOutputPath = `${filePath}-temp`;
  await sharp(filePath).resize(1200, 800).toFile(tempOutputPath);

  // Replace the original file with the resized one
  fs.renameSync(tempOutputPath, filePath);
};

async function bufferFromRequest(req: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();

  if (!reader) {
    throw new Error("Could not read request body");
  }

  let done: boolean | undefined = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = readerDone;
  }

  return Buffer.concat(chunks);
}

function headersToObject(headers: Headers): Record<string, string> {
  const obj: Record<string, string> = {};
  headers.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  try {
    const buffer = await bufferFromRequest(req);
    const headers = headersToObject(req.headers);

    // Create a readable stream from the buffer
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // No more data

    // Create an IncomingMessage-like object
    const fakeReq = Object.assign(stream, {
      headers,
      method: req.method,
      url: req.url,
    }) as IncomingMessage;

    const parseForm = (): Promise<{ fields: any; files: any }> =>
      new Promise((resolve, reject) => {
        form.parse(fakeReq, (err, fields, files) => {
          if (err) {
            reject(err);
          } else {
            resolve({ fields, files });
          }
        });
      });

    const { fields, files } = await parseForm();

    const id = Array.isArray(fields.id) ? fields.id[0] : fields.id; // Ensure id is a single string
    const photo = Array.isArray(files.image)
      ? files.image[0]
      : (files.image as FormidableFile | undefined);

    if (!id || !photo) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    const originalFilename = photo.originalFilename || ""; // Handle potential null
    const fileName = uuidv4() + path.extname(originalFilename); // Use empty string if null
    const outputFilePath = path.join(uploadDir, fileName);
    const outputFilePath2 = path.join(uploadDir2, fileName); // Path for the second directory

    // Move and resize the image to the first directory
    fs.renameSync(photo.filepath, outputFilePath);
    await resizeImage(outputFilePath);

    // Copy the file to the second directory
    fs.copyFileSync(outputFilePath, outputFilePath2);

    // Fetch the current images from the database
    const connection = await pool.getConnection();
    const [rows] = await connection.query<any[]>(
      "SELECT Image FROM photoalbum WHERE Id = ?",
      [id]
    );

    if (rows.length === 0) {
      connection.release();
      return NextResponse.json(
        { message: "Photo album not found" },
        { status: 404 }
      );
    }

    const images = JSON.parse(rows[0].Image) as string[];
    images.push(`/Uploads/PhotoAlbum/${fileName}`);

    // Update the database with the new image
    const [updateResult] = await connection.query<any>(
      "UPDATE photoalbum SET Image = ? WHERE Id = ?",
      [JSON.stringify(images), id]
    );
    connection.release();

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { message: "Failed to update photo album" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        newImagePath: `/Uploads/PhotoAlbum/${fileName}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing image upload:", error);
    return NextResponse.json(
      { message: "Error uploading photo" },
      { status: 500 }
    );
  }
}
