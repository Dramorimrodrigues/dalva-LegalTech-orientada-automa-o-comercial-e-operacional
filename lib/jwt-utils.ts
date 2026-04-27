import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface DecodedToken {
    userId: string;
    orgId: string;
    iat: number;
    exp: number;
}

export function generateToken(userId: string, orgId: string = 'org-admin'): string {
    return jwt.sign(
      { userId, orgId },
          JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
        );
}

export function verifyToken(token: string): DecodedToken | null {
    try {
          return jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
          return null;
    }
}
