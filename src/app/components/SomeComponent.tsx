// ใน Component ที่ต้องการใช้ข้อมูล session
"use client";
import { useContext } from "react";
import SessionContext from "@/app/SessionContext";

export default function SomeComponent() {
  const session = useContext(SessionContext);

  return <div>ยินดีต้อนรับ {session?.user?.name}</div>;
}
