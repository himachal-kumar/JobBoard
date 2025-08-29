"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireCandidate = exports.requireEmployer = exports.requireRole = exports.authenticateRefreshToken = exports.authenticateToken = void 0;
const jwt_service_1 = require("../services/jwt.service");
const user_schema_1 = require("../../user/user.schema");
/**
 * Express middleware to authenticate and authorize user by access token.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Access token required" });
            return;
        }
        const decoded = jwt_service_1.JWTService.verifyAccessToken(token);
        if (!decoded.userId) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        const user = yield user_schema_1.UserModel.findById(decoded.userId).select("-password -refreshToken");
        if (!user || user.blocked) {
            res.status(401).json({ message: "User not found or blocked" });
            return;
        }
        req.user = user;
        req.token = token;
        next();
    }
    catch (error) {
        if (error instanceof Error && error.message === "jwt expired") {
            res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
        }
        else if (error instanceof Error && error.message === "Invalid access token") {
            res.status(401).json({ message: "Invalid token" });
        }
        else {
            res.status(500).json({ message: "Authentication error" });
        }
    }
});
exports.authenticateToken = authenticateToken;
/**
 * Express middleware to authenticate and authorize user by refresh token.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
const authenticateRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token required" });
            return;
        }
        const decoded = jwt_service_1.JWTService.verifyRefreshToken(refreshToken);
        if (!decoded.userId) {
            res.status(401).json({ message: "Invalid refresh token" });
            return;
        }
        const user = yield user_schema_1.UserModel.findById(decoded.userId).select("+refreshToken");
        if (!user || user.blocked || user.refreshToken !== refreshToken) {
            res.status(401).json({ message: "Invalid refresh token" });
            return;
        }
        req.body.userId = decoded.userId;
        next();
    }
    catch (error) {
        if (error instanceof Error && error.message === "jwt expired") {
            res.status(401).json({ message: "Refresh token expired" });
        }
        else if (error instanceof Error && error.message === "Invalid access token") {
            res.status(401).json({ message: "Invalid refresh token" });
        }
        else {
            res.status(500).json({ message: "Token verification error" });
        }
    }
});
exports.authenticateRefreshToken = authenticateRefreshToken;
/**
 * Express middleware to check if a user has one of the given roles.
 *
 * @param {string[]} roles - List of allowed roles.
 * @returns {import('express').RequestHandler} Express middleware.
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: "Insufficient permissions" });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireEmployer = (0, exports.requireRole)(["EMPLOYER", "ADMIN"]);
exports.requireCandidate = (0, exports.requireRole)(["CANDIDATE", "ADMIN"]);
exports.requireAdmin = (0, exports.requireRole)(["ADMIN"]);
