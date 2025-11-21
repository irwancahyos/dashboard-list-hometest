"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-(--primary-color)">
      <h1 className="text-4xl font-bold text-(--text-primary-color)">404</h1>
      <p className="text-lg text-(--text-primary-color)">Maaf, halaman yang anda cari tidak ada.</p>
      <Link href="/" className="text-white bg-teal-600 px-4 py-2 rounded hover:bg-teal-700 font-bold">
        Kembali ke Dashboard
      </Link>
    </div>
  );
}