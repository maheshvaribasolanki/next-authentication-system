"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const router = useRouter();

  const [form, setForm] =
    useState({
      name: "",
      username: "",
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/auth/signup",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              form
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Signup failed"
        );

        return;
      }

      router.push(
        `/verify-email?email=${encodeURIComponent(
          form.email
        )}`
      );
    } catch {
      setError(
        "Something went wrong. Please try again."
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
          Create Account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create your account to get started.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Name
        </label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full rounded-lg border p-3 outline-none focus:ring-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Username
        </label>

        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="username"
          className="w-full rounded-lg border p-3 outline-none focus:ring-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Email
        </label>

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full rounded-lg border p-3 outline-none focus:ring-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Password
        </label>

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full rounded-lg border p-3 outline-none focus:ring-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black p-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Creating account..."
          : "Create Account"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-black underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}