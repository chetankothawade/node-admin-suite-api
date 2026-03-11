// utils/token.js
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    const payload = { id: user.id, role: user.role };

    let secret = process.env.SECRET_KEY;
    let expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    // Different config per role
    if (user.role === "admin" || user.role === "super_admin") {
        secret = process.env.ADMIN_SECRET_KEY || process.env.SECRET_KEY;
        expiresIn = process.env.ADMIN_JWT_EXPIRES_IN || "1d";
    }

    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token, role = null) => {
    try {
        let secret = process.env.SECRET_KEY;
        if (role === "admin" || role === "super_admin") {
            secret = process.env.ADMIN_SECRET_KEY || process.env.SECRET_KEY;
        }
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};


