import { PDFDocument, rgb } from 'pdf-lib';
const fontkit = require('fontkit');
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const POST = async (req: NextRequest) => {
  try {
    const { departments } = await req.json();
    const uploadDirectory = path.join(process.cwd(), 'public', 'Uploads', 'Election', 'Department');

    // Ensure the directory exists
    await fs.mkdir(uploadDirectory, { recursive: true });

    // Load the custom font (THSarabun.ttf)
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'THSarabun.ttf');
    const fontBytes = await fs.readFile(fontPath);

    // Create a new PDFDocument and register fontkit with a type assertion
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit as any); // Use type assertion to avoid TypeScript errors

    for (const department of departments) {
      if (!department.name) {
        throw new Error('Department name is missing.');
      }

      // Create a portrait A4 page (595.28 x 841.89 points)
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
      const { width, height } = page.getSize();

      // Define margins (0.4 inch margins)
      const margin = 28.8; // 0.4 inch = 28.8 points
      const contentWidth = width - (2 * margin); // Available width after margins

      // Embed the custom font
      const customFont = await pdfDoc.embedFont(fontBytes);

      // Set the font size for table headers and data
      const fontSize = 16;

      // Title at the header margin
      page.drawText('Election Data', {
        x: margin,  // Start after the left margin
        y: height - margin,  // Start after the top margin (header)
        size: 20,
        font: customFont,
        color: rgb(0, 0, 0),
      });

      // Define the column widths in percentage of the content width (after margins)
      const columnWidths = {
        index: 0.06 * contentWidth,  // ลำดับที่ (6%)
        member: 0.0914 * contentWidth, // เลขสมาชิก (9.14%)
        fullname: 0.2857 * contentWidth, // ชื่อ - สกุล (28.57%)
        department: 0.3643 * contentWidth, // หน่วยงาน (36.43%)
        position: 0.1743 * contentWidth // ช่อง ลำดับที่ (17.43%)
      };

      // Starting X positions for each column (adjust to fit properly within margins)
      const positions = {
        index: margin,  // Start at the left margin
        member: margin + columnWidths.index,
        fullname: margin + columnWidths.index + columnWidths.member,
        department: margin + columnWidths.index + columnWidths.member + columnWidths.fullname,
        position: margin + columnWidths.index + columnWidths.member + columnWidths.fullname + columnWidths.department,
      };

      // Headers
      const headers = ["ลำดับที่", "เลขสมาชิก", "ชื่อ - สกุล", "หน่วยงาน", "ช่อง ลำดับที่"];

      // Draw the table headers (center-aligned horizontally and vertically)
      const headerRowHeight = 30;
      const headerYPosition = height - margin - 40;

      headers.forEach((header, index) => {
        const xPosition = Object.values(positions)[index] + (Object.values(columnWidths)[index] / 2);
        const yCentered = headerYPosition - (headerRowHeight / 2) + (fontSize / 2); // Adjust for vertical centering

        page.drawText(header, {
          x: xPosition - (customFont.widthOfTextAtSize(header, fontSize) / 2), // Center horizontally
          y: yCentered, // Center vertically
          size: fontSize,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      });

      // Draw header borders (vertical and horizontal)
      const headerBottomY = height - margin - 40 - headerRowHeight; // Y position for the bottom of the header
      const drawHeaderBorders = () => {
        // Draw horizontal top and bottom borders for the header
        page.drawLine({
          start: { x: margin, y: height - margin - 40 }, // Top line
          end: { x: width - margin, y: height - margin - 40 },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
        page.drawLine({
          start: { x: margin, y: headerBottomY }, // Bottom line
          end: { x: width - margin, y: headerBottomY },
          thickness: 1,
          color: rgb(0, 0, 0),
        });

        // Draw vertical lines for each column in the header
        const xPositions = Object.values(positions);
        xPositions.push(width - margin); // Add the last right border
        xPositions.forEach(x => {
          page.drawLine({
            start: { x, y: height - margin - 40 }, // Start at top of header
            end: { x, y: headerBottomY }, // End at bottom of header
            thickness: 1,
            color: rgb(0, 0, 0),
          });
        });
      };

      // Draw the borders for the header
      drawHeaderBorders();

      // Draw borders (horizontal and vertical) for the entire table
      const rowHeight = 30; // Space between each row
      let yPosition = headerBottomY - rowHeight; // Start position for the first row after headers

      // Function to draw all the borders for the rows
      const drawTableBorders = (rowCount: number) => {
        // Draw vertical lines for the columns
        const xPositions = Object.values(positions);
        xPositions.push(width - margin); // Add the last right border

        // Draw horizontal and vertical lines for rows
        for (let row = 0; row <= rowCount; row++) {
          const yLinePosition = headerBottomY - (row * rowHeight);
          // Draw horizontal line for the current row
          page.drawLine({
            start: { x: margin, y: yLinePosition },
            end: { x: width - margin, y: yLinePosition },
            thickness: 1,
            color: rgb(0, 0, 0),
          });

          // Draw vertical lines for the columns
          xPositions.forEach(x => {
            page.drawLine({
              start: { x, y: headerBottomY }, // Start from bottom of header
              end: { x, y: yLinePosition }, // Bottom of row
              thickness: 1,
              color: rgb(0, 0, 0),
            });
          });
        }
      };

      // Draw the borders for the rows (data rows)
      drawTableBorders(department.members.length);

      // Draw the table data (center-aligned horizontally and vertically)
      department.members.forEach((member: any, index: number) => {
        const memberData = [
          (index + 1).toString(), // ลำดับที่ (index)
          member.Member, // เลขสมาชิก
          member.FullName, // ชื่อ - สกุล
          member.Department, // หน่วยงาน
          `${member.FieldNumber} ${member.SequenceNumber}`, // ช่อง ลำดับที่
        ];

        memberData.forEach((text, idx) => {
          const xPosition = Object.values(positions)[idx] + (Object.values(columnWidths)[idx] / 2);
          const yCentered = yPosition + (rowHeight / 2) - (fontSize / 2); // Adjust for vertical centering

          page.drawText(text, {
            x: xPosition - (customFont.widthOfTextAtSize(text, fontSize) / 2), // Center horizontally
            y: yCentered, // Center vertically
            size: fontSize,
            font: customFont,
            color: rgb(0, 0, 0),
          });
        });

        // Move to the next row
        yPosition -= rowHeight;
      });

      const pdfBytes = await pdfDoc.save();

      // Define the file path and file name based on the department name
      const filePath = path.join(uploadDirectory, `${department.name}.pdf`);
      await fs.writeFile(filePath, pdfBytes);
    }

    return NextResponse.json({ message: 'PDFs generated and saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error generating PDFs:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to generate PDFs: ' + errorMessage }, { status: 500 });
  }
};
