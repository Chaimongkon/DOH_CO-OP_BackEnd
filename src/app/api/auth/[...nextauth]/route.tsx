// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from "../../../db/mysql";

import { RowDataPacket } from "mysql2";

interface DBUser extends RowDataPacket {
  Id: number;
  FullName: string;
  UserName: string;
  PassWord: string;
  CreatedAt: Date;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        let connection;
        try {
          connection = await pool.getConnection();

          const [rows] = await connection.execute<DBUser[]>(
            "SELECT * FROM users WHERE UserName = ?",
            [credentials.username]
          );

          if (rows.length === 0) {
            return null;
          }

          const user = rows[0];

          const isValid = await bcrypt.compare(
            credentials.password,
            user.PassWord
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user.Id,
            name: user.FullName,
            username: user.UserName,
          } as User;
        } catch (error) {
          throw new Error("Internal server error");
        } finally {
          if (connection) {
            await connection.release();
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/Login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = Number(token.id);
        session.user.username = token.username as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
