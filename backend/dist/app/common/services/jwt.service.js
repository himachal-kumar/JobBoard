"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
class JWTService {
    // Default secrets for development (should be overridden in production)
    static getJwtSecret() {
        return process.env.JWT_SECRET || "dev-jwt-secret-key-change-in-production";
    }
    static getJwtRefreshSecret() {
        return process.env.JWT_REFRESH_SECRET || "dev-jwt-refresh-secret-key-change-in-production";
    }
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.getJwtSecret(), {
            expiresIn: this.ACCESS_TOKEN_EXPIRY,
            issuer: "job-board-api",
            audience: "job-board-users",
        });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.getJwtRefreshSecret(), {
            expiresIn: this.REFRESH_TOKEN_EXPIRY,
            issuer: "job-board-api",
            audience: "job-board-users",
        });
    }
    static generateTokenPair(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }
    static verifyAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.getJwtSecret());
        }
        catch (error) {
            throw new Error("Invalid access token");
        }
    }
    static verifyRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.getJwtRefreshSecret());
        }
        catch (error) {
            throw new Error("Invalid refresh token");
        }
    }
    static generateSecureRefreshToken() {
        return crypto_1.default.randomBytes(64).toString("hex");
    }
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            return null;
        }
    }
    static isTokenExpired(token) {
        try {
            const decoded = jsonwebtoken_1.default.decode(token);
            if (!decoded || !decoded.exp)
                return true;
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        }
        catch (error) {
            return true;
        }
    }
}
exports.JWTService = JWTService;
JWTService.ACCESS_TOKEN_EXPIRY = "15m";
JWTService.REFRESH_TOKEN_EXPIRY = "7d";
