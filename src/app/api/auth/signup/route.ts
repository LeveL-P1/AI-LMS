import { NextResponse } from "next/server";
import { db } from "@/lib/prisma/prisma";
import { hashPassword } from "@/lib/auth/password";
import { SignUpInput, signUpSchema } from "@/lib/auth/validators";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as Partial<SignUpInput>;
  const parsed = signUpSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { email, name, password } = parsed.data;
  const existing = await db.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json(
      { error: { email: ["This email is already synced."] } },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  await createSession(user.id);

  return NextResponse.json({ user }, { status: 201 });
}

