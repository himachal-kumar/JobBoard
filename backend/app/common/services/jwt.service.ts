import jwt from "jsonwebtoken";
import crypto from "crypto";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JWTService {
  private static readonly ACCESS_TOKEN_EXPIRY = "15m";
  private static readonly REFRESH_TOKEN_EXPIRY = "7d";

  // Default secrets for development (should be overridden in production)
  static getJwtSecret(): string {
    return process.env.JWT_SECRET || "dev-jwt-secret-key-change-in-production";
  }

  static getJwtRefreshSecret(): string {
    return process.env.JWT_REFRESH_SECRET || "dev-jwt-refresh-secret-key-change-in-production";
  }

  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.getJwtSecret(), {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      issuer: "job-board-api",
      audience: "job-board-users",
    });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.getJwtRefreshSecret(), {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      issuer: "job-board-api",
      audience: "job-board-users",
    });
  }

  static generateTokenPair(payload: TokenPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.getJwtSecret()) as TokenPayload;
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.getJwtRefreshSecret()) as TokenPayload;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  static generateSecureRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  static decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}
