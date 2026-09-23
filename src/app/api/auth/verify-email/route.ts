import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyOtpSchema } from "@/lib/validations";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const result =
      verifyOtpSchema.safeParse(body);

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
      email,
      otp,
    } = result.data;

    await connectDB();

    const user =
      await User.findOne({
        email:
          email.toLowerCase(),
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User not found",
        },
        { status: 404 }
      );
    }

    if (
      user.isEmailVerified
    ) {
      return NextResponse.json({
        success: true,
        message:
          "Email is already verified",
      });
    }

    if (
      !user.otp ||
      !user.otpExpiresAt
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OTP not found. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    if (
      user.otpExpiresAt <
      new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "OTP has expired. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    if (
      user.otp !== otp
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid OTP",
        },
        { status: 400 }
      );
    }

    user.isEmailVerified =
      true;

    user.otp =
      undefined;

    user.otpExpiresAt =
      undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message:
        "Email verified successfully",
    });
  } catch (error) {
    console.error(
      "Verify email error:",
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