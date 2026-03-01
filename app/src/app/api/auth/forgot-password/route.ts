import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { getRecoveryEmailHtml } from "./recovery-email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const users = await sql`SELECT id FROM users WHERE email = ${email}`;

    if (users.length === 0) {
      // Return success even if user doesn't exist for security (avoid email enumeration)
      return NextResponse.json(
        {
          message:
            "If an account exists with this email, you will receive a reset link shortly.",
        },
        { status: 200 },
      );
    }

    const userId = users[0].id;
    const hash = crypto.randomBytes(32).toString("hex");

    // Save hash to user
    await sql`UPDATE users SET forgot_password_hash = ${hash} WHERE id = ${userId}`;

    // Prepare email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const recoveryLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${hash}`;

    const mailOptions = {
      from: `"Divisor" <${process.env.SUPPORT_EMAIL_TO}>`,
      to: email,
      replyTo: email,
      subject: "Reset your password",
      html: getRecoveryEmailHtml(recoveryLink),
    };

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.log("SMTP not configured. Recovery link:", recoveryLink);
      return NextResponse.json(
        { message: "Recovery instructions sent (Mock mode)" },
        { status: 200 },
      );
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message:
          "If an account exists with this email, you will receive a reset link shortly.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
