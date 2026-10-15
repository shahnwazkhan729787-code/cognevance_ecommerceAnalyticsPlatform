import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "apexcommerce_enterprise_secret_2026";

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getUserFromRequest(request) {
  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    if (!token) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split(";").map((c) => {
            const [k, ...v] = c.trim().split("=");
            return [k, v.join("=")];
          })
        );
        token = cookies["token"];
      }
    }

    if (!token) return null;
    return verifyToken(token);
  } catch (err) {
    console.error("Auth extraction error:", err);
    return null;
  }
}

export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}
