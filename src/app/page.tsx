import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-lg">
        <h1 className="text-4xl font-bold">
          Auth App
        </h1>

        <p className="mt-3 text-gray-500">
          Next.js authentication system
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-black px-6 py-3 font-medium text-white"
          >
            Sign Up
          </Link>

          <Link
            href="/signin"
            className="rounded-lg border px-6 py-3 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}