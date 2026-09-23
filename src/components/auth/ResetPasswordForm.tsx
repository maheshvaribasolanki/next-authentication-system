"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({
  token,
}: ResetPasswordFormProps) {
  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError(
        "Invalid reset link."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/auth/reset-password",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              token,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to reset password"
        );

        return;
      }

      setMessage(
        "Password reset successfully."
      );

      setTimeout(() => {
        router.push("/signin");
      }, 1000);
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
          Reset Password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your new password.
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
        type="password"
        required
        minLength={8}
        value={password}
        onChange={(event) =>
          setPassword(
            event.target.value
          )
        }
        placeholder="New password"
        className="w-full rounded-lg border p-3"
      />

      <input
        type="password"
        required
        minLength={8}
        value={confirmPassword}
        onChange={(event) =>
          setConfirmPassword(
            event.target.value
          )
        }
        placeholder="Confirm password"
        className="w-full rounded-lg border p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
      >
        {loading
          ? "Resetting..."
          : "Reset Password"}
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