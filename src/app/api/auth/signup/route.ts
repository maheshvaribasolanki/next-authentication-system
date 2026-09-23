import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signupSchema } from "@/lib/validations";
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

    const result =
      signupSchema.safeParse(body);

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
      name,
      username,
      email,
      password,
    } = result.data;

    await connectDB();

    const normalizedEmail =
      email.toLowerCase();

    const normalizedUsername =
      username.toLowerCase();

    const existingUser =
      await User.findOne({
        $or: [
          {
            email:
              normalizedEmail,
          },
          {
            username:
              normalizedUsername,
          },
        ],
      });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email or username already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    const otp =
      generateOTP();

    const otpExpiresAt =
      getOTPExpiry();

    const user =
      await User.create({
        name,
        username:
          normalizedUsername,
        email:
          normalizedEmail,
        password:
          hashedPassword,
        isEmailVerified:
          false,
        otp,
        otpExpiresAt,
      });

    try {
      await sendOTPEmail(
        normalizedEmail,
        otp
      );
    } catch (emailError) {
      console.error(
        "Email sending failed:",
        emailError
      );

      await User.findByIdAndDelete(
        user._id
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to send verification email. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created. Verification OTP sent.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Signup error:",
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