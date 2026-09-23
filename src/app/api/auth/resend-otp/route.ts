import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import {
  generateOTP,
  getOTPExpiry,
} from "@/lib/otp";
import { sendOTPEmail } from "@/lib/mail";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const email =
      body?.email
        ?.toString()
        .trim()
        .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user =
      await User.findOne({
        email,
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
      return NextResponse.json(
        {
          success: false,
          message:
            "Email is already verified",
        },
        { status: 400 }
      );
    }

    const otp =
      generateOTP();

    user.otp = otp;

    user.otpExpiresAt =
      getOTPExpiry();

    await user.save();

    await sendOTPEmail(
      email,
      otp
    );

    return NextResponse.json({
      success: true,
      message:
        "New OTP sent successfully",
    });
  } catch (error) {
    console.error(
      "Resend OTP error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to resend OTP",
      },
      { status: 500 }
    );
  }
}