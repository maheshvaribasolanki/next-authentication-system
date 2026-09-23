import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { resetPasswordSchema } from "@/lib/validations";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const result =
      resetPasswordSchema.safeParse(
        body
      );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            result.error.issues[0]
              ?.message ||
            "Invalid input",
        },
        { status: 400 }
      );
    }

    const {
      token,
      password,
    } = result.data;

    const tokenHash =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    await connectDB();

    const user =
      await User.findOne({
        resetToken: tokenHash,
        resetTokenExpiresAt: {
          $gt: new Date(),
        },
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Reset link is invalid or expired",
        },
        { status: 400 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    user.password =
      hashedPassword;

    user.resetToken =
      undefined;

    user.resetTokenExpiresAt =
      undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message:
        "Password reset successfully",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
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