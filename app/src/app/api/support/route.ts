import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

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
      from: `"Contato Divisor" <${email}>`,
      to: process.env.SUPPORT_EMAIL_TO,
      replyTo: email,
      subject: `[Support Request] ${subject}`,
      text: `From: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6d28d9;">New Support Request</h2>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    };

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.log(
        "SMTP HOST or USER not configured. Logging email content instead:",
      );
      console.log(mailOptions);
      return NextResponse.json(
        { message: "Verification successful (Mock mode: SMTP not configured)" },
        { status: 200 },
      );
    }

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Support request sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending support email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
