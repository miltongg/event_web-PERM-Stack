import jwt from "jsonwebtoken";

type VerifyType = {
  id: string,
  name: string,
  email: string,
  role: string
}

export function generateToken(userInfo: object) {
    return jwt.sign(userInfo, process.env.JWT_KEY!, {
      expiresIn: "1y"
    });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_KEY!) as VerifyType;
}