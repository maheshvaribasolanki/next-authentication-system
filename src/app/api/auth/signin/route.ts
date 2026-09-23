import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signinSchema } from "@/lib/validations";
import { createSession } from "@/lib/session";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const result =
      signinSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password",
        },
        { status: 400 }
      );
    }

    const {
      email,
      password,
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
            "Invalid email or password",
        },
        { status: 401 }
      );
    }

    if (
      !user.isEmailVerified
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please verify your email first",
        },
        { status: 403 }
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password",
        },
        { status: 401 }
      );
    }

    await createSession(
      user._id.toString()
    );

    return NextResponse.json({
      success: true,
      message:
        "Login successful",
    });
  } catch (error) {
    console.error(
      "Signin error:",
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