'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const route = useRouter();
  
  useEffect(() => {
    route.push('/inventory');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--primary-color)" />
  );
}
