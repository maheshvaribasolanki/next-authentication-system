import { NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { forgotPasswordSchema } from "@/lib/validations";
import { sendResetPasswordEmail } from "@/lib/mail";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const result =
      forgotPasswordSchema.safeParse(
        body
      );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email",
        },
        { status: 400 }
      );
    }

    const email =
      result.data.email.toLowerCase();

    await connectDB();

    const user =
      await User.findOne({
        email,
      });

    /*
      We return the same message whether
      the email exists or not.
      This prevents email enumeration.
    */

    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists, a reset email has been sent.",
      });
    }

    const rawToken =
      crypto.randomBytes(32).toString("hex");

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    user.resetToken =
      tokenHash;

    user.resetTokenExpiresAt =
      new Date(
        Date.now() +
          15 * 60 * 1000
      );

    await user.save();

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const resetUrl =
      `${appUrl}/reset-password?token=${rawToken}`;

    await sendResetPasswordEmail(
      email,
      resetUrl
    );

    return NextResponse.json({
      success: true,
      message:
        "If an account exists, a reset email has been sent.",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong",
      },
      { status: 500 }
    );
  }
}