import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { githubId, name, email, avatarUrl } = await req.json();
    if (!githubId) {
      return NextResponse.json({ error: "Missing githubId" }, { status: 400 });
    }
    let user = await User.findOne({ githubId });
    if (!user) {
      user = await User.create({ githubId, name, email, avatarUrl });
    }
    return NextResponse.json(
      { id: user._id, githubId: user.githubId, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }
}