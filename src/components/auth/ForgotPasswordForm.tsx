"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/auth/forgot-password",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to process request"
        );

        return;
      }

      setMessage(
        "If an account exists with this email, a password reset link has been sent."
      );
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
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
          {message}
        </div>
      )}

      <input
        type="email"
        required
        value={email}
        onChange={(event) =>
          setEmail(
            event.target.value
          )
        }
        placeholder="you@example.com"
        className="w-full rounded-lg border p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
      >
        {loading
          ? "Sending..."
          : "Send Reset Link"}
      </button>

      <p className="text-center text-sm">
        <Link
          href="/signin"
          className="underline"
        >
          Back to Sign In
        </Link>
      </p>
    </form>
  );
}