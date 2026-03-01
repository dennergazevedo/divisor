import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signJwt } from "@/lib/auth";
import nodemailer from "nodemailer";
import { getWelcomeEmailHtml } from "./welcome-email";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${normalizedEmail}, ${passwordHash}, ${name ?? null})
      RETURNING id, email, name
    `;

    // Send Welcome Email
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: `"Divisor" <${process.env.SUPPORT_EMAIL_TO}>`,
          to: email,
          replyTo: email,
          subject: "Welcome to Divisor!",
          html: getWelcomeEmailHtml(user.name || ""),
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail registration if email fails
      }
    } else {
      console.log(
        "SMTP not configured. Welcome email would be sent to:",
        email,
      );
    }

    const token = signJwt({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.JWT_EXPIRES_IN ?? 60 * 60 * 24 * 7),
    });

    return response;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Error registering user." },
      { status: 500 },
    );
  }
}
