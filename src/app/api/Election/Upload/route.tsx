// app/api/upload/route.ts
import { NextResponse } from "next/server";
import pool from "../../../db/mysql"; // Import MySQL connection pool

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { data } = await req.json();

    // SQL query for inserting the data
    const query = `
      INSERT INTO election (Member, IdCard, FullName, Department, FieldNumber, SequenceNumber, MemberType, CreateDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    // Iterate over the data array and insert each row into the database
    for (const row of data) {
      const {
        Member,
        IdCard,
        FullName,
        Department,
        FieldNumber,
        SequenceNumber,
        MemberType,
      } = row;

      // Insert data into the MySQL database
      await pool.query(query, [
        Member,
        IdCard,
        FullName,
        Department,
        FieldNumber,
        SequenceNumber,
        MemberType,
      ]);
    }

    // Respond with success
    return NextResponse.json({
      message: "Data inserted successfully",
      data,
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { error: "Error processing data" },
      { status: 500 }
    );
  }
}
