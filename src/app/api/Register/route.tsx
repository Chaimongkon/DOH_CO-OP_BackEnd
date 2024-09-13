// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "../../db/mysql";

export async function POST(request: Request) {
  let connection;
  try {
    const { name, username, password } = await request.json();

    if (!name || !username || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    connection = await pool.getConnection();

    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE UserName = ?",
      [username]
    );

    if ((existingUsers as any).length > 0) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      "INSERT INTO users (FullName, UserName, PassWord) VALUES (?, ?, ?)",
      [name, username, hashedPassword]
    );

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
