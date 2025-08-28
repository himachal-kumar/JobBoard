import { type NextFunction, type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { JWTService, type TokenPayload } from "../services/jwt.service";
import { type IUser, ProviderType } from "../../user/user.dto";

/**
 * Express middleware to authenticate and authorize user by role.
 *
 * @param {IUser['role'][]} roles - List of allowed roles.
 * @param {string[]} publicRoutes - List of public routes that don't require authentication.
 * @returns {import('express-async-handler').AsyncHandler} Express middleware.
 */
export const roleAuth = (roles: IUser["role"][], publicRoutes: string[] = []) =>
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (publicRoutes.includes(req.path)) {
        next();
        return;
      }
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        throw createHttpError(401, {
          message: `Invalid token`,
        });
      }
      try {
        const decodedUser = JWTService.verifyAccessToken(token);
        // Create a minimal user object with the required properties
        req.user = {
          _id: decodedUser.userId,
          role: decodedUser.role,
          email: decodedUser.email,
          name: "",
          provider: ProviderType.MANUAL,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as IUser;
      } catch (error: any) {
        if (error.message === "jwt expired") {
          throw createHttpError(401, {
            message: `Token expired`,
            data: {
              type: "TOKEN_EXPIRED",
            },
          });
        }
        throw createHttpError(400, {
          message: error.message,
        });
      }
      const user = req.user as IUser;
      if (!roles.includes(user.role)) {
        const type =
          user.role.slice(0, 1) + user.role.slice(1).toLocaleLowerCase();

        throw createHttpError(401, {
          message: `${type} can not access this resource`,
        });
      }
      next();
    }
  );
