// pages/api/election-data.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from "../../../db/mysql"; // Assuming you have db connection

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const [rows] = await pool.query(`
        SELECT Id, Member, IdCard, FullName, Department, FieldNumber, SequenceNumber, MemberType 
        FROM election
      `);
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch election data' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };