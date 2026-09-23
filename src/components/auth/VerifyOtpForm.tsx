"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface VerifyOtpFormProps {
  initialEmail: string;
}

export default function VerifyOtpForm({
  initialEmail,
}: VerifyOtpFormProps) {
  const router = useRouter();

  const [email, setEmail] =
    useState(initialEmail);

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function verifyOtp(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/auth/verify-email",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              otp,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Invalid OTP"
        );

        return;
      }

      setMessage(
        "Email verified successfully."
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

  async function resendOtp() {
    setResending(true);
    setError("");
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/auth/resend-otp",
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
            "Unable to resend OTP"
        );

        return;
      }

      setMessage(
        "A new OTP has been sent."
      );
    } catch {
      setError(
        "Something went wrong."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <form
      onSubmit={verifyOtp}
      className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
    >
      <div>
        <h1 className="text-3xl font-bold">
          Verify Email
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter the OTP sent to your email.
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

      <div>
        <label className="mb-1 block text-sm font-medium">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Verification Code
        </label>

        <input
          value={otp}
          onChange={(event) =>
            setOtp(
              event.target.value
                .replace(/\D/g, "")
                .slice(0, 6)
            )
          }
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          className="w-full rounded-lg border p-3 text-center text-2xl tracking-[0.5em]"
        />
      </div>

      <button
        type="submit"
        disabled={
          loading ||
          otp.length !== 6
        }
        className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
      >
        {loading
          ? "Verifying..."
          : "Verify Email"}
      </button>

      <button
        type="button"
        onClick={resendOtp}
        disabled={resending}
        className="w-full rounded-lg border p-3 font-medium disabled:opacity-50"
      >
        {resending
          ? "Sending..."
          : "Resend OTP"}
      </button>

      <p className="text-center text-sm text-gray-600">
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