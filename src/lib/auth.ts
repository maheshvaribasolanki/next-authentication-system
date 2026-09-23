import { redirect } from "next/navigation";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getSession } from "@/lib/session";

export async function getCurrentUser() {
  const session =
    await getSession();

  if (!session) {
    return null;
  }

  await connectDB();

  const user =
    await User.findById(
      session.userId
    ).select(
      "-password -otp -resetToken"
    );

  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    email: user.email,
    isEmailVerified:
      user.isEmailVerified,
  };
}

export async function requireUser() {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return user;
}