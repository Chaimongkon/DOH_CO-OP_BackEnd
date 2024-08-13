"use client"
import TextEditor from "@/app/components/TextEditor";
import Link from "next/link";
import { useState } from "react";

export default function CoopHistory() {
  const [editorContent, setEditorContent] = useState('');
    return (
      <>
        <TextEditor value={editorContent} onChange={setEditorContent} />
      </>
    );

}
