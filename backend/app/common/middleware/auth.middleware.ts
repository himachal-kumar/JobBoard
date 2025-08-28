import { Request, Response, NextFunction } from "express";
import { JWTService } from "../services/jwt.service";
import { UserModel } from "../../user/user.schema";

export interface AuthRequest extends Request {
  user?: any;
  token?: string;
}

/**
 * Express middleware to authenticate and authorize user by access token.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Access token required" });
      return;
    }

    const decoded = JWTService.verifyAccessToken(token) as any;
    
    if (!decoded.userId) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const user = await UserModel.findById(decoded.userId).select("-password -refreshToken");
    
    if (!user || user.blocked) {
      res.status(401).json({ message: "User not found or blocked" });
      return;
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof Error && error.message === "jwt expired") {
      res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
    } else if (error instanceof Error && error.message === "Invalid access token") {
      res.status(401).json({ message: "Invalid token" });
    } else {
      res.status(500).json({ message: "Authentication error" });
    }
  }
};

/**
 * Express middleware to authenticate and authorize user by refresh token.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
export const authenticateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token required" });
      return;
    }

    const decoded = JWTService.verifyRefreshToken(refreshToken) as any;
    
    if (!decoded.userId) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const user = await UserModel.findById(decoded.userId).select("+refreshToken");
    
    if (!user || user.blocked || user.refreshToken !== refreshToken) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof Error && error.message === "jwt expired") {
      res.status(401).json({ message: "Refresh token expired" });
    } else if (error instanceof Error && error.message === "Invalid access token") {
      res.status(401).json({ message: "Invalid refresh token" });
    } else {
      res.status(500).json({ message: "Token verification error" });
    }
  }
};

/**
 * Express middleware to check if a user has one of the given roles.
 *
 * @param {string[]} roles - List of allowed roles.
 * @returns {import('express').RequestHandler} Express middleware.
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
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

export const requireEmployer = requireRole(["EMPLOYER", "ADMIN"]);
export const requireCandidate = requireRole(["CANDIDATE", "ADMIN"]);
export const requireAdmin = requireRole(["ADMIN"]);
