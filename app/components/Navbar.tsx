"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `px-4 h-full flex items-center justify-center transition ${
      pathname === path ? "bg-gray-700" : "hover:bg-gray-500"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 h-14 text-white">
      <div className="flex items-center justify-between h-full px-4">
        {/* App Icon */}
        {/* <div className="text-xl font-bold">
            <Link href="/" className="">My App</Link>
        </div> */}

        {/* Centered Nav Links */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-14 flex space-x-2">
          <Link href="/" className={linkClasses("/")}>Medic</Link>
          <Link href="/rag" className={linkClasses("/rag")}>RAG</Link>
          <Link href="/coder" className={linkClasses("/coder")}>CODER</Link>
          {/* 
            we will add contact and about in the footer
           */}
        </div>
      </div>
    </nav>
  );
}
