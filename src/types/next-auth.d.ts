// next-auth.d.ts
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name?: string;
      username: string;
      userrole: string;
    };
  }
  interface User {
    id: number;
    name?: string;
    username: string;
    userrole: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string | number;
    username: string;
  }
}

