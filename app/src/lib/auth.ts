import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
  tenantId: string;
  email: string;
};

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}
