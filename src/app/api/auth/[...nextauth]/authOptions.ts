// src/app/api/auth/[...nextauth]/authOptions.ts

import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import pool from '../../../db/mysql';
import { RowDataPacket } from 'mysql2';
import { Session } from 'next-auth';

interface DBUser extends RowDataPacket {
  Id: number;
  FullName: string;
  UserName: string;
  PassWord: string;
  UserRole: string;
  CreatedAt: Date;
}

interface CustomUser extends User {
  id: number;
  username: string;
  userrole: string;
  remember?: boolean;
}

interface CustomSession extends Session {
  user: {
    id: number;
    name?: string;
    username: string;
    userrole: string;
    remember?: boolean;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        remember: { label: 'Remember this Device', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) {
          console.log('No credentials provided');
          return null;
        }

        let connection;
        try {
          connection = await pool.getConnection();

          console.log('Connected to the database');

          const [rows] = await connection.execute<DBUser[]>(
            'SELECT * FROM users WHERE UserName = ?',
            [credentials.username]
          );

          if (rows.length === 0) {
            console.log('No user found with this username');
            return null;
          }

          const user = rows[0];

          const isValid = await bcrypt.compare(credentials.password, user.PassWord);
          if (!isValid) {
            console.log('Incorrect password');
            return null;
          }

          // Convert 'remember' string to boolean
          const remember = credentials.remember === 'true';
          return {
            id: user.Id,
            name: user.FullName,
            username: user.UserName,
            userrole: user.UserRole,
            remember,
          } as CustomUser;
        } catch (error) {
          console.error('Error in authorize function:', error);
          throw new Error('Internal server error');
        } finally {
          if (connection) {
            await connection.release();
            console.log('Connection released');
          }
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // Default session expiration (30 minutes)
    updateAge: 5 * 60, // Update session every 5 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.username = customUser.username;
        token.userrole = customUser.userrole;
        token.remember = customUser.remember;

        // Set a longer expiration for 'remember me'
        if (customUser.remember) {
          token.maxAge = 30 * 24 * 60 * 60; // 30 days if 'Remember me' is checked
        }
      }
      return token;
    },
    async session({ session, token }) {
      const customSession = session as CustomSession;

      if (token) {
        customSession.user.id = Number(token.id);
        customSession.user.username = token.username as string;
        customSession.user.userrole = token.userrole as string;
        customSession.user.remember = token.remember as boolean;
      }
      return customSession;
    },
  },
};
