import jwt, { SignOptions } from "jsonwebtoken";

type JwtPayload = {
  userId: string;
  tenantIds: string[];
  email: string;
};

export function signJwt(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não definido");
  }

  const options: SignOptions = {
    expiresIn: Number(process.env.JWT_EXPIRES_IN ?? 604800),
  };

  return jwt.sign(payload, secret, options);
}
