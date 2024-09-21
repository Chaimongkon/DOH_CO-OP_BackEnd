// app/SessionContext.tsx
import { createContext } from "react";
import { Session } from "next-auth";

const SessionContext = createContext<Session | null>(null);
export default SessionContext;
