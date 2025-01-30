import { NextResponse, NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import pool from "../../../../db/mysql";

type Params = {
  id: string;
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = params;

  try {
    const formData = await request.formData();
    const no = formData.get("no") as string;
    const imageFile = formData.get("image") as File | null;
    const urllink = formData.get("urllink") as string;

    // Base query for updating
    let query = "UPDATE slides SET No = ?, URLLink = ?, UpdateDate = NOW()";
    const paramsArray: (string | null)[] = [no, urllink];

    if (imageFile) {
      // Ensure the upload directory exists
      const uploadsImageDir = path.join(process.cwd(), "public/Uploads/Slides");
      await fs.mkdir(uploadsImageDir, { recursive: true });

      // Determine the file extension and whether it's a PNG
      const fileExtension = imageFile.name.split(".").pop()?.toLowerCase();
      const isPng = fileExtension === "png";

      // Generate a unique name for the file and save as WebP
      const imageUUID = `${uuidv4()}.webp`;
      const imagePath = path.join(uploadsImageDir, imageUUID);

      // Convert image to WebP if PNG, or save as original format otherwise
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      if (isPng) {
        const webpBuffer = await sharp(imageBuffer).webp().toBuffer();
        await fs.writeFile(imagePath, webpBuffer);
      } else {
        await fs.writeFile(imagePath, imageBuffer);
      }

      // Add the file path to the query and parameters
      query += ", ImagePath = ?";
      paramsArray.push(`/Uploads/Slides/${imageUUID}`);
    }

    // Finalize query and add the ID parameter
    query += " WHERE Id = ?";
    paramsArray.push(id);

    // Execute the query
    const [result]: any = await pool.query(query, paramsArray);

    return NextResponse.json({
      message: "Update successful",
      updatedSlide: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "Update failed",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
