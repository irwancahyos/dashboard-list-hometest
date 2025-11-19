import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-(--primary-color)">
      <div className="p-9 rounded-full shadow-xl bg-(--secondary-color)">
        <h1 className="text-(--text-primary)">First set up application</h1>
      </div>
    </div>
  );
}
