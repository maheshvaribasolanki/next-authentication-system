"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SigninForm() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/auth/signin",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Login failed"
        );

        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
    >
      <div>
        <h1 className="text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to your account.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
          placeholder="you@example.com"
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
          placeholder="••••••••"
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-sm underline"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black p-3 font-medium text-white disabled:opacity-50"
      >
        {loading
          ? "Signing in..."
          : "Sign In"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-black underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}