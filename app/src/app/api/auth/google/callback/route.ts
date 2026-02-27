import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { signJwt } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=no_code", req.url));
  }

  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
  );

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const userInfoResponse = await client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });

    const userInfo = userInfoResponse.data as {
      sub: string;
      email: string;
      name: string;
      picture?: string;
    };

    const { sub: googleId, email, name } = userInfo;
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if user already exists
    const users = await sql`
      SELECT id, email, provider_id
      FROM users
      WHERE provider_id = ${googleId} OR LOWER(email) = ${normalizedEmail}
      LIMIT 1
    `;

    let userId: string;

    if (users.length === 0) {
      // 2. Create new user if they don't exist
      const newUsers = await sql`
        INSERT INTO users (email, name, provider_id, plan_status, current_plan)
        VALUES (${normalizedEmail}, ${name}, ${googleId}, 'active', 'free')
        RETURNING id
      `;
      userId = newUsers[0].id;
    } else {
      const user = users[0];
      userId = user.id;

      // 3. Link Google account if not linked yet
      if (!user.provider_id) {
        await sql`
          UPDATE users
          SET provider_id = ${googleId}, name = COALESCE(name, ${name})
          WHERE id = ${userId}
        `;
      }
    }

    // 4. Generate JWT
    const token = signJwt({
      userId,
      email: normalizedEmail,
    });

    // 5. Redirect to home/dashboard with cookie
    const response = NextResponse.redirect(new URL("/", req.url));

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.JWT_EXPIRES_IN ?? 60 * 60 * 24 * 7),
    });

    return response;
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=google_auth_failed", req.url),
    );
  }
}
