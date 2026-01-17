import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
};

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
