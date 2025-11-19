import { NextResponse } from "next/server";
import { db } from "@/lib/prisma/prisma";
import { credentialsSchema } from "@/lib/auth/validators";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const parsed = credentialsSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { email, password } = parsed.data;
  const user = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      status: true,
      role: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: { email: ["We couldn't find a profile with that email."] } },
      { status: 404 }
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: { password: ["That passphrase feels off. Try again."] } },
      { status: 401 }
    );
  }

  if (user.status !== "ACTIVE") {
    return NextResponse.json(
      { error: { status: ["Your profile needs activation. Ping support."] } },
      { status: 403 }
    );
  }

  await createSession(user.id);

  const { passwordHash, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}

