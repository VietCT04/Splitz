import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // TODO: replace with real DB lookup + hashed password check
  const ok = email === "demo@site.com" && password === "password123";
  if (!ok) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // In dev (http) cookie must NOT be secure, in prod it SHOULD be secure
  const secure = process.env.NODE_ENV === "production";

  res.cookies.set({
    name: "session",
    value: "opaque-session-id-or-jwt",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
