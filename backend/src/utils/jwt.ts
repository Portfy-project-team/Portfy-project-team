import jwt from "jsonwebtoken";

type TokenPayload = {
  userId: number;
  role?: string;
};

export const generateAccessToken = ({
  userId,
  role,
}: TokenPayload) => {

  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = ({
  userId,
}: TokenPayload) => {

  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as TokenPayload;
};